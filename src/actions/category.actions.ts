"use server";
import { auth } from "@/auth";
import { UploadTable, db } from "@/db";
import { CategoryTable } from "@/db/schema/category";
import { createMainUrl, createThumbnailUrl } from "@/lib/string.helper";
import { CreateCategorySchema, EditCategorySchema } from "@/validators/category.validators";
import { eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getPaginationValues } from "./action.helpers";
import { PaginationParams } from "./action.types";

export interface GetCategoriesActionPayload {
  pagination?: PaginationParams;
}
export type GetCategoriesActionResponse = Awaited<ReturnType<typeof getAllCategoriesAction>>;

export const getAllCategoriesAction = async ({ pagination }: GetCategoriesActionPayload = {}) => {
  const { page, limit, offset } = getPaginationValues(pagination);
  const getCategories = db
    .select({
      id: CategoryTable.id,
      title: CategoryTable.title,
      slug: CategoryTable.slug,
      rank: CategoryTable.rank,
      description: CategoryTable.description,
      parentCategoryId: CategoryTable.parentCategoryId,
      image: {
        id: UploadTable.id,
        url: UploadTable.path,
        thumbnailUrl: UploadTable.path,
      },
      createdAt: CategoryTable.createdAt,
      updatedAt: CategoryTable.updatedAt,
      archivedAt: CategoryTable.archivedAt,
    })
    .from(CategoryTable)
    .leftJoin(UploadTable, eq(CategoryTable.image, UploadTable.id))
    .where(isNull(CategoryTable.archivedAt))
    .limit(limit)
    .offset(offset);

  const getTotalCount = db.select().from(CategoryTable).where(isNull(CategoryTable.archivedAt));

  const [categories, totalCount] = await Promise.all([getCategories, getTotalCount]);

  const categoriesWithImageUrls = categories.map((category) => ({
    ...category,
    image: category.image
      ? {
          id: category.image.id,
          url: createMainUrl(category.image.url),
          thumbnailUrl: createThumbnailUrl(category.image.url),
        }
      : null,
  }));
  return {
    categories: categoriesWithImageUrls,
    page,
    limit,
    totalCount,
  };
};
export const createCategoryAction = async (payload: z.infer<typeof CreateCategorySchema>) => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const { success, data, error } = CreateCategorySchema.safeParse(payload);
  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }
  const [{ id }] = await db
    .insert(CategoryTable)
    .values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      parentCategoryId: data.parentCategoryId,
      image: data.imageId,
      rank: data.rank,
      updatedBy: session.user.id,
    })
    .returning({ id: CategoryTable.id });
  return {
    id,
  };
};

export const editCategoryAction = async (payload: z.infer<typeof EditCategorySchema>) => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const { success, data, error } = EditCategorySchema.safeParse(payload);
  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }
  const [{ id }] = await db
    .update(CategoryTable)
    .set({
      title: data.title,
      slug: data.slug,
      description: data.description,
      parentCategoryId: data.parentCategoryId,
      image: data.imageId,
      rank: data.rank,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(CategoryTable.id, payload.id))
    .returning({ id: CategoryTable.id });
  return {
    id,
  };
};

export const deleteCategoryByIdAction = async ({ id }: { id: string }) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }
  return await db
    .update(CategoryTable)
    .set({ archivedAt: new Date() })
    .where(eq(CategoryTable.id, id))
    .returning({ id: CategoryTable.id });
};
