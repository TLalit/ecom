import { auth } from "@/auth";
import { db, UploadTable } from "@/db";
import { UploadFileToS3 } from "@/lib/aws-s3";
import { respondError, respondJson, respondUnauthorizedError } from "@/lib/server.helpers";
import { addThumbnailPrefix, createMainUrl, createThumbnailUrl } from "@/lib/string.helper";
import { PostUploadRequest, PostUploadResponse } from "@/types/upload.api.type";

import sharp from "sharp";
export const POST = auth(async (req) => {
  try {
    if (!req.auth) return respondUnauthorizedError;
    const { user } = req.auth;

    const { assetType, entityType, file } = await parseFormData(req);
    if (!file || !assetType || !entityType) {
      return respondError({ message: "Missing required fields", status: 400 });
    }
    const fileName = `${entityType}/${assetType}-${Date.now()}.webp`;
    const compressedFile = await compressAndConvertFile(file, fileName);
    const thumbnailFile = await createThumbnail(compressedFile, fileName);
    const [compressed] = await Promise.all([UploadFileToS3(compressedFile), UploadFileToS3(thumbnailFile)]);
    if (!compressed.Key) return respondError({ message: "Error uploading file", status: 500 });
    const { id, path } = await db
      .insert(UploadTable)
      .values({
        assetType,
        entityType,
        path: compressed.Key,
        uploadedBy: user.id,
      })
      .returning({
        id: UploadTable.id,
        path: UploadTable.path,
      })
      .then((res) => res[0]);
    const data: PostUploadResponse = {
      id,
      url: createMainUrl(path),
      thumbnailUrl: createThumbnailUrl(path),
    };
    return respondJson({
      data,
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading file", error);
    return respondError({ message: "Error uploading file", status: 500 });
  }
});
const parseFormData = async (req: any) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const assetType = formData.get("assetType") as PostUploadRequest["assetType"];
  const entityType = formData.get("entityType") as PostUploadRequest["entityType"];
  return { file, assetType, entityType };
};

const createThumbnail = async (file: File, fileName: string) => {
  const fileBuffer = await file.arrayBuffer();
  const thumbnailFileBuffer = await sharp(fileBuffer)
    .resize({
      width: 600,
      height: 800,
      fit: sharp.fit.cover,
      fastShrinkOnLoad: true,
      position: sharp.strategy.entropy,
    })
    .toBuffer();

  const compressedFile = new File([new Uint8Array(thumbnailFileBuffer)], addThumbnailPrefix(fileName), {
    type: file.type,
    lastModified: Date.now(),
  });
  return compressedFile;
};

const compressAndConvertFile = async (file: File, fileName: string) => {
  const fileBuffer = await file.arrayBuffer();

  const compressedFileBuffer = await sharp(fileBuffer)
    .toFormat("webp", {
      quality: 80,
    })
    .toBuffer();
  const compressedFile = new File([new Uint8Array(compressedFileBuffer)], fileName, {
    type: file.type,
    lastModified: Date.now(),
  });
  return compressedFile;
};
