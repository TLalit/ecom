import { auth } from "@/auth";
import { collection, db, upload } from "@/db";
import {
  getPaginationValues,
  getRoles,
  respondError,
  respondJson,
  respondUnauthorizedError,
} from "@/lib/server.helpers";
import { createMainUrl, createThumbnailUrl } from "@/lib/string.helper";
import {
  GetCollectionResponse,
  PostCollectionRequestValidator,
  StatusEnum,
  VisibilityEnum,
} from "@/types/collection.api.types";
import { and, count, eq, inArray, isNull } from "drizzle-orm";

export const POST = auth(async (req) => {
  try {
    if (!req.auth) return respondUnauthorizedError;
    if (!getRoles(req)?.includes("admin")) return respondUnauthorizedError;

    const { user } = req.auth;
    const requestBody = await req.json();
    const { success, data, error } =
      PostCollectionRequestValidator.safeParse(requestBody);
    if (!success) {
      return respondError({
        status: 400,
        message: "Invalid request body",
        err: error,
      });
    }
    const { id } = await db
      .insert(collection)
      .values({
        ...data,
        updatedBy: user.id,
      })
      .returning()
      .then((res) => res[0]);
    return respondJson({ data: { id }, status: 201 });
  } catch (error) {
    console.error("Error Creating Collection", error);
    return respondError({ message: "Error Creating Collection", status: 500 });
  }
});
export const GET = auth(async (req) => {
  try {
    if (!req.auth) return respondUnauthorizedError;
    if (!getRoles(req)?.includes("admin")) return respondUnauthorizedError;
    const { page, limit, offset } = getPaginationValues(req);
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

    const collectionWithImageUrls = collections.map((collection) => ({
      ...collection,
      slug: collection.slug,
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

    return respondJson<GetCollectionResponse>({
      data: {
        collections: collectionWithImageUrls,
        page,
        limit,
        total: totalCount,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error Fetching Collections", error);
    return respondError({ message: "Error Fetching Collections", status: 500 });
  }
});
