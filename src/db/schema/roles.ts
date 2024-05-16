import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const userRoleTable = pgTable("user_role", {
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
});
