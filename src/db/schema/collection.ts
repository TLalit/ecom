import { isNull } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const collectionTable = pgTable(
  "collection",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    status: text("status").notNull(),
    visibility: text("visibility").notNull(),
    imageId: uuid("image_id"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).defaultNow(),
    archivedAt: timestamp("archived_at", {
      withTimezone: true,
    }),
  },
  (collection) => ({
    index: uniqueIndex()
      .on(collection.slug)
      .where(isNull(collection.archivedAt)),
  }),
);
