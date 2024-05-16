import { relations } from "drizzle-orm";
import { userRoleTable } from "./roles";
import { userTable } from "./user";

export const UserRelations = relations(userTable, ({ many }) => ({
  roles: many(userRoleTable),
}));

export const RolesRelations = relations(userRoleTable, ({ one }) => ({
  roles: one(userTable, {
    fields: [userRoleTable.userId],
    references: [userTable.id],
  }),
}));
