import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const RegionTable = pgTable("region", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: text('region').notNull(),
    currency: text('currency').notNull(),
})