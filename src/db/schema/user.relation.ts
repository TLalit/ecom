import { relations } from "drizzle-orm";
import { userTable } from "./user";
import { userRoleTable } from "./userRole";

export const UserRelations = relations(userTable, ({ many }) => ({
  roles: many(userRoleTable),
}));

export const RolesRelations = relations(userRoleTable, ({ one }) => ({
  roles: one(userTable, {
    fields: [userRoleTable.userId],
    references: [userTable.id],
  }),
}));
