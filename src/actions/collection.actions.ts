"use server";
import { auth } from "@/auth";
import { CollectionTable, db, UploadTable } from "@/db";
import { getFirst } from "@/lib/array.helpers";
import { createMainUrl, createThumbnailUrl } from "@/lib/string.helper";
import { StatusEnum, VisibilityEnum } from "@/types/collection.api.types";
import { CreateCollectionSchema, EditCollectionSchema } from "@/validators/collection.validators";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import { getPaginationValues } from "./action.helpers";
import { PaginationParams } from "./action.types";

export interface GetCollectionPayload extends PaginationParams {}
export type GetCollectionActionResponse = Awaited<ReturnType<typeof getCollectionAction>>;
export const getCollectionAction = async ({ ...paginationParams }: GetCollectionPayload = {}) => {
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
      id: CollectionTable.id,
      title: CollectionTable.title,
      description: CollectionTable.description,
      image: {
        id: UploadTable.id,
        url: UploadTable.path,
        thumbnailUrl: UploadTable.path,
      },
      slug: CollectionTable.slug,
      status: CollectionTable.status,
      visibility: CollectionTable.visibility,
    })
    .from(CollectionTable)
    .where(
      and(
        isNull(CollectionTable.archivedAt),
        inArray(CollectionTable.status, statusArray),
        inArray(CollectionTable.visibility, visibilityArray),
      ),
    )
    .leftJoin(UploadTable, eq(CollectionTable.imageId, UploadTable.id))
    .limit(limit)
    .offset(offset);

  const getTotalCount = db
    .select({
      total: count(CollectionTable.id),
    })
    .from(CollectionTable)
    .where(
      and(
        isNull(CollectionTable.archivedAt),
        inArray(CollectionTable.status, statusArray),
        inArray(CollectionTable.visibility, visibilityArray),
      ),
    )
    .then((res) => res[0].total);

  const [collections, totalCount] = await Promise.all([getCollection, getTotalCount]);

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
        id: CollectionTable.id,
        title: CollectionTable.title,
        description: CollectionTable.description,
        image: {
          id: UploadTable.id,
          url: UploadTable.path,
        },
        slug: CollectionTable.slug,
        status: CollectionTable.status,
        visibility: CollectionTable.visibility,
      })
      .from(CollectionTable)
      .where(
        and(
          isNull(CollectionTable.archivedAt),
          eq(CollectionTable.slug, slug),
          inArray(CollectionTable.visibility, visibilityArray),
          inArray(CollectionTable.status, statusArray),
        ),
      )
      .leftJoin(UploadTable, eq(CollectionTable.imageId, UploadTable.id)),
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

export const createCollectionAction = async (payload: z.infer<typeof CreateCollectionSchema>) => {
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
    .insert(CollectionTable)
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
  return await db.delete(CollectionTable).where(eq(CollectionTable.id, id)).returning({ id: CollectionTable.id });
};
export const editCollectionAction = async (payload: z.infer<typeof EditCollectionSchema>) => {
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
    .update(CollectionTable)
    .set({
      ...dataToUpdate,
      updatedBy: session?.user.id,
      updatedAt: new Date(),
    })
    .where(eq(CollectionTable.id, collectionId))
    .returning()
    .then((res) => res[0]);
  return { id };
};
