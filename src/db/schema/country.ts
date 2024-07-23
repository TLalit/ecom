import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const CountryTable = pgTable("country", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  regionId: uuid("region_id"),
  updatedBy: uuid("updated_by").notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});
