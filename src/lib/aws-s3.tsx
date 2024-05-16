"use server";
import { AWS_BUCKET_NAME, AWS_REGION } from "@/constants";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ?? "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? "";

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
export const UploadFileToS3 = async (file: File) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Body: file,
      Bucket: AWS_BUCKET_NAME,
      Key: file.name,
      ContentType: file.type,
    },
  });
  const result = await upload.done();
  return result;
};
