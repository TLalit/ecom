import { integer, jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { CategoryTable } from "./category";
import { CollectionTable } from "./collection";
import { UploadTable } from "./upload";

export const productStatusEnum = pgEnum("status", ["draft", "published"]);
export const productTable = pgTable("product", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  slug: text("slug").notNull(),
  categoryId: uuid("category_id").references(() => CategoryTable.id),
  status: productStatusEnum("status").default("draft"),
});

export const productCollectionTable = pgTable("product_collection", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  productId: uuid("product_id").references(() => productTable.id),
  collectionId: uuid("collection_id").references(() => CollectionTable.id),
});

export const productImagesTable = pgTable("product_images", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  productId: uuid("product_id").references(() => productTable.id),
  variantId: uuid("variant_id").references(() => productVariantTable.id),
  imageId: uuid("image_id").references(() => UploadTable.id),
});

export const productVariantTable = pgTable("product_variants", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  title: text("title").notNull(),
  productId: uuid("product_id").references(() => productTable.id),
  hsCode: text("hs_code"),
  midCode: text("mid_code"),
  material: text("material"),
  inventory_quantity: integer("inventory_quantity").default(0),
});

export const productOptionTable = pgTable("product_options", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  productId: uuid("product_id").references(() => productTable.id),
  title: text("title").notNull(),
});

export const productOptionValueTable = pgTable("product_option_values", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  variantId: uuid("variant_id").references(() => productVariantTable.id),
  optionId: uuid("option_id").references(() => productOptionTable.id),
  value: text("value").notNull(),
  metaData: jsonb("meta_data"),
});
