"use server";
import { collection, db, upload } from "@/db";
import { getFirst } from "@/lib/array.helpers";
import { createMainUrl, createThumbnailUrl } from "@/lib/string.helper";
import { StatusEnum, VisibilityEnum } from "@/types/collection.api.types";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import { getPaginationValues } from "../action.helpers";
import { PaginationParams } from "../action.types";
import { ICollection } from "./collection.types";

interface GetCollectionPayload extends PaginationParams {}

export const getCollection = async ({
  ...paginationParams
}: GetCollectionPayload = {}) => {
  const { page, limit, offset } = getPaginationValues(paginationParams);
  const visibilityArray = [VisibilityEnum.PUBLIC, VisibilityEnum.PRIVATE];

  const getCollection = db
    .select({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      image: {
        id: upload.id,
        url: upload.path,
      },
      slug: collection.slug,
      status: collection.status,
      visibility: collection.visibility,
    })
    .from(collection)
    .where(
      and(
        isNull(collection.archivedAt),
        inArray(collection.visibility, visibilityArray),
      ),
    )
    .leftJoin(upload, eq(collection.imageId, upload.id))
    .limit(limit)
    .offset(offset);
  const getTotalCount = db
    .select({
      total: count(collection.id),
    })
    .from(collection)
    .where(
      and(
        isNull(collection.archivedAt),
        inArray(collection.visibility, visibilityArray),
      ),
    )
    .then((res) => res[0].total);
  const [collections, totalCount] = await Promise.all([
    getCollection,
    getTotalCount,
  ]);

  const collectionWithImageUrls: ICollection[] = collections.map(
    (collection) => ({
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
    }),
  );

  return {
    collections: collectionWithImageUrls,
    page,
    limit,
    total: totalCount,
  };
};

export const getCollectionBySlug = async ({ slug }: { slug: string }) => {
  const visibilityArray = [VisibilityEnum.PUBLIC, VisibilityEnum.PRIVATE];

  const collectionBySlug = await getFirst(
    db
      .select({
        id: collection.id,
        title: collection.title,
        description: collection.description,
        image: {
          id: upload.id,
          url: upload.path,
        },
        slug: collection.slug,
        status: collection.status,
        visibility: collection.visibility,
      })
      .from(collection)
      .where(
        and(
          isNull(collection.archivedAt),
          eq(collection.slug, slug),
          inArray(collection.visibility, visibilityArray),
        ),
      )
      .leftJoin(upload, eq(collection.imageId, upload.id)),
  );

  if (!collectionBySlug) {
    return null;
  }

  const collectionWithImageUrls: ICollection = {
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

export const deleteCollectionById = async ({ id }: { id: string }) => {
  const isDeleted = await db.delete(collection).where(eq(collection.id, id));

  return true;
};
