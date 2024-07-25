import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const UploadTable = pgTable("upload", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  path: text("path").notNull(),
  entityType: text("entity_type").notNull(),
  assetType: text("asset_type").notNull(),
  uploadedBy: uuid("uploaded_by").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  archivedAt: timestamp("archived_at", {
    withTimezone: true,
  }),
});
