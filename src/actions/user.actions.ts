"use server";

import { db, UserRoleTable, UserTable } from "@/db";
import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";

export type GetTeamActionResponse = Awaited<ReturnType<typeof getTeamAction>>;

export const getTeamAction = async () => {
  const teamList = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      emailVerified: UserTable.emailVerified,
      profilePicture: UserTable.profilePicture,
      createdAt: UserTable.createdAt,
      updatedAt: UserTable.updatedAt,
      roles: sql<string[]>`array_agg(${UserRoleTable.role})`.as("roles"),
    })
    .from(UserTable)
    .leftJoin(UserRoleTable, eq(UserTable.id, UserRoleTable.userId))
    .where(and(isNotNull(UserRoleTable.role), isNull(UserTable.archivedAt)))
    .groupBy(UserTable.id);
  return {
    team: teamList,
  };
};
