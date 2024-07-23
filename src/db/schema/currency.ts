import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const currencyTable = pgTable("currency", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull().unique(),
  symbol: text("symbol").notNull(),
  code: text("code").notNull(),
  value: integer("value").default(0).notNull(),
  isDefault: boolean("is_default").notNull(),
  isAvailable: boolean("is_available").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedBy: text("updated_by").notNull(),
});
