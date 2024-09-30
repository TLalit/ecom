"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import {
  productCollectionTable,
  productImageTable,
  productTable,
  productVariantOptionValueTable,
  productVariantTable,
} from "../db/schema";

export const getAllProduct = async () => {
  const products = await db.select().from(productTable);

  return products;
};

const createProductSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  slug: z.string(),
  categoryId: z.string().uuid(),
  status: z.enum(["draft", "published"]).default("draft"),
  collectionId: z.string().uuid().optional(),
  images: z
    .array(
      z.object({
        id: z.string().uuid(),
        order: z.number().int(),
      }),
    )
    .optional(),
});

export async function createProduct(data: z.infer<typeof createProductSchema>) {
  const parsedData = createProductSchema.parse(data);

  try {
    const result = await db.transaction(async (trx) => {
      const [insertedProduct] = await trx.insert(productTable).values(parsedData).returning();

      if (parsedData.collectionId) {
        await trx.insert(productCollectionTable).values({
          productId: insertedProduct.id,
          collectionId: parsedData.collectionId,
        });
      }

      if (parsedData.images) {
        const imageEntries = parsedData.images.map((image) => ({
          productId: insertedProduct.id,
          imageId: image.id,
          order: image.order,
        }));
        await trx.insert(productImageTable).values(imageEntries);
      }

      return insertedProduct;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating product: ${error.message}`);
    } else {
      throw new Error("Unknown error creating product");
    }
  }
}

const createVariantSchema = z.object({
  productId: z.string().uuid(),
  title: z.string(),
  hsCode: z.string().optional(),
  midCode: z.string().optional(),
  material: z.string().optional(),
  inventory_quantity: z.number().int().nonnegative(),
  price: z.number().positive(),
  images: z
    .array(
      z.object({
        id: z.string().uuid(),
        order: z.number().int(),
      }),
    )
    .optional(),
  variantValueId: z.string().uuid().optional(),
});

export async function createVariant(data: z.infer<typeof createVariantSchema>) {
  const parsedData = createVariantSchema.parse(data);

  try {
    await db.transaction(async (trx) => {
      const [insertedVariant] = await trx
        .insert(productVariantTable)
        .values({
          title: parsedData.title,
          productId: parsedData.productId,
          hsCode: parsedData.hsCode,
          midCode: parsedData.midCode,
          material: parsedData.material,
          inventory_quantity: parsedData.inventory_quantity,
          price: parsedData.price,
          variantValueId: parsedData.variantValueId,
        })
        .returning();

      if (parsedData.images) {
        const imageEntries = parsedData.images.map((image) => ({
          variantId: insertedVariant.id,
          imageId: image.id,
          order: image.order,
        }));
        await trx.insert(productImageTable).values(imageEntries);
      }
      return insertedVariant;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating variant: ${error.message}`);
    } else {
      throw new Error("Unknown error creating variant");
    }
  }
}

export async function deleteProductImage(imageId: string) {
  try {
    await db.transaction(async (trx) => {
      await trx.delete(productImageTable).where(eq(productImageTable.id, imageId));
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error deleting product image: ${error.message}`);
    } else {
      throw new Error("Unknown error deleting product image");
    }
  }
}

export async function deleteVariant(variantId: string) {
  try {
    await db.transaction(async (trx) => {
      // Delete the variant itself
      const [res] = await trx.delete(productVariantTable).where(eq(productVariantTable.id, variantId)).returning();
      if (!res) {
        throw new Error("Variant not found");
      }
      // Delete associated product images
      await trx.delete(productImageTable).where(eq(productImageTable.variantId, variantId));

      // Delete associated variant option values
      if (res.variantValueId) {
        await trx
          .delete(productVariantOptionValueTable)
          .where(eq(productVariantOptionValueTable.id, res.variantValueId));
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error deleting variant: ${error.message}`);
    } else {
      throw new Error("Unknown error deleting variant");
    }
  }
}
