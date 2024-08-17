import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const CategoryTable = pgTable("category", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  parentCategoryId: uuid("parent_category_id"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  rank: integer("rank").default(0),
  image: uuid("image"),
  description: text("description"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updated_by").notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  archivedAt: timestamp("archived_at", {
    withTimezone: true,
  }),
});
