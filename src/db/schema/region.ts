import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const RegionTable = pgTable("region", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: text('region').notNull(),
    currencyId: uuid('currency_id').notNull(),
    updatedBy: uuid("updated_by").notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    }).defaultNow(),
})