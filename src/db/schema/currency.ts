import { isNull } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const currency = pgTable("currency", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull().unique(),
  symbol: text("symbol").notNull().unique(),
  code: text("code").notNull(),
  value: text("value").notNull(),
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
});
