import { UserRoles } from "@/types/db.types";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
export const UserRoleTable = pgTable("user_role", {
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  role: text("role").notNull().$type<UserRoles>(),
});
