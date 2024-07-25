import { relations } from "drizzle-orm";
import { UserTable } from "./user";
import { UserRoleTable } from "./userRole";

export const UserRelations = relations(UserTable, ({ many }) => ({
  roles: many(UserRoleTable),
}));

export const RolesRelations = relations(UserRoleTable, ({ one }) => ({
  roles: one(UserTable, {
    fields: [UserRoleTable.userId],
    references: [UserTable.id],
  }),
}));
