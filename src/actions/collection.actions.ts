"use server";
import { auth } from "@/auth";
import { collectionTable, db, uploadTable } from "@/db";
import { getFirst } from "@/lib/array.helpers";
import { createMainUrl, createThumbnailUrl } from "@/lib/string.helper";
import { StatusEnum, VisibilityEnum } from "@/types/collection.api.types";
import {
  CreateCollectionSchema,
  EditCollectionSchema,
} from "@/validators/collection.validators";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import { getPaginationValues } from "./action.helpers";
import { PaginationParams } from "./action.types";

export interface GetCollectionPayload extends PaginationParams {}
export type GetCollectionActionResponse = Awaited<
  ReturnType<typeof getCollectionAction>
>;
export const getCollectionAction = async ({
  ...paginationParams
}: GetCollectionPayload = {}) => {
  const { page, limit, offset } = getPaginationValues(paginationParams);
  const visibilityArray = [VisibilityEnum.PUBLIC];
  const statusArray = [StatusEnum.ACTIVE];

  const session = await auth();
  if (session?.user?.roles.includes("admin")) {
    visibilityArray.push(VisibilityEnum.PRIVATE);
    statusArray.push(StatusEnum.INACTIVE);
  }

  const getCollection = db
    .select({
      id: collectionTable.id,
      title: collectionTable.title,
      description: collectionTable.description,
      image: {
        id: uploadTable.id,
        url: uploadTable.path,
        thumbnailUrl: uploadTable.path,
      },
      slug: collectionTable.slug,
      status: collectionTable.status,
      visibility: collectionTable.visibility,
    })
    .from(collectionTable)
    .where(
      and(
        isNull(collectionTable.archivedAt),
        inArray(collectionTable.status, statusArray),
        inArray(collectionTable.visibility, visibilityArray),
      ),
    )
    .leftJoin(uploadTable, eq(collectionTable.imageId, uploadTable.id))
    .limit(limit)
    .offset(offset);

  const getTotalCount = db
    .select({
      total: count(collectionTable.id),
    })
    .from(collectionTable)
    .where(
      and(
        isNull(collectionTable.archivedAt),
        inArray(collectionTable.status, statusArray),
        inArray(collectionTable.visibility, visibilityArray),
      ),
    )
    .then((res) => res[0].total);

  const [collections, totalCount] = await Promise.all([
    getCollection,
    getTotalCount,
  ]);

  const collectionWithImageUrls = collections.map((collection) => ({
    ...collection,
    status: collection.status as StatusEnum,
    visibility: collection.visibility as VisibilityEnum,
    image: collection.image
      ? {
          id: collection.image.id,
          url: createMainUrl(collection.image.url),
          thumbnailUrl: createThumbnailUrl(collection.image.url),
        }
      : null,
  }));

  return {
    collections: collectionWithImageUrls,
    page,
    limit,
    total: totalCount,
  };
};

export const getCollectionBySlugAction = async ({ slug }: { slug: string }) => {
  const visibilityArray = [VisibilityEnum.PUBLIC];
  const statusArray = [StatusEnum.ACTIVE];

  const session = await auth();
  if (session?.user?.roles.includes("admin")) {
    visibilityArray.push(VisibilityEnum.PRIVATE);
    statusArray.push(StatusEnum.INACTIVE);
  }

  const collectionBySlug = await getFirst(
    db
      .select({
        id: collectionTable.id,
        title: collectionTable.title,
        description: collectionTable.description,
        image: {
          id: uploadTable.id,
          url: uploadTable.path,
        },
        slug: collectionTable.slug,
        status: collectionTable.status,
        visibility: collectionTable.visibility,
      })
      .from(collectionTable)
      .where(
        and(
          isNull(collectionTable.archivedAt),
          eq(collectionTable.slug, slug),
          inArray(collectionTable.visibility, visibilityArray),
          inArray(collectionTable.status, statusArray),
        ),
      )
      .leftJoin(uploadTable, eq(collectionTable.imageId, uploadTable.id)),
  );

  if (!collectionBySlug) {
    return null;
  }

  const collectionWithImageUrls = {
    ...collectionBySlug,
    slug: collectionBySlug.slug,
    status: collectionBySlug.status as StatusEnum,
    visibility: collectionBySlug.visibility as VisibilityEnum,
    image: collectionBySlug.image
      ? {
          id: collectionBySlug.image.id,
          url: createMainUrl(collectionBySlug.image.url),
          thumbnailUrl: createThumbnailUrl(collectionBySlug.image.url),
        }
      : null,
  };
  return collectionWithImageUrls;
};

export const createCollectionAction = async (
  payload: z.infer<typeof CreateCollectionSchema>,
) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const { success, data, error } = CreateCollectionSchema.safeParse(payload);
  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }
  const { id } = await db
    .insert(collectionTable)
    .values({
      ...data,
      updatedBy: session?.user.id,
    })
    .returning()
    .then((res) => res[0]);
  return { id };
};

export const deleteCollectionByIdAction = async ({ id }: { id: string }) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }
  return await db
    .delete(collectionTable)
    .where(eq(collectionTable.id, id))
    .returning({ id: collectionTable.id });
};
export const editCollectionAction = async (
  payload: z.infer<typeof EditCollectionSchema>,
) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const { success, data, error } = EditCollectionSchema.safeParse(payload);
  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }
  const { id: collectionId, ...dataToUpdate } = data;
  const { id } = await db
    .update(collectionTable)
    .set({
      ...dataToUpdate,
      updatedBy: session?.user.id,
      updatedAt: new Date(),
    })
    .where(eq(collectionTable.id, collectionId))
    .returning()
    .then((res) => res[0]);
  return { id };
};
