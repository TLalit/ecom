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

export const productImageTable = pgTable("product_images", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  productId: uuid("product_id").references(() => productTable.id),
  variantId: uuid("variant_id").references(() => productVariantTable.id),
  imageId: uuid("image_id").references(() => UploadTable.id),
  order: integer("order").default(0),
});

export const productVariantOptionTable = pgTable("product_variant_option", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
});

export const productVariantOptionValueTable = pgTable("product_variant_option_value", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  optionId: uuid("variant_option_id").references(() => productVariantOptionTable.id),
  name: text("name").notNull(),
  metaData: jsonb("meta_data").notNull(),
});

export const productVariantTable = pgTable("product_variants", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  title: text("title").notNull(),
  productId: uuid("product_id").references(() => productTable.id),
  hsCode: text("hs_code"),
  midCode: text("mid_code"),
  material: text("material"),
  inventory_quantity: integer("inventory_quantity").default(0),
  price: integer("price").default(0),
  variantValueId: uuid("variant_value_id").references(() => productVariantOptionValueTable.id),
});
