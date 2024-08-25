"use server";
import { auth } from "@/auth";
import { db, UserRoleTable, UserTable } from "@/db";
import { saltAndHashPassword } from "@/lib/password";
import { UserRoles } from "@/types/db.types";
import { createTeamMemberSchema, updateTeamMemberSchema } from "@/validators/user.validators";
import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { z } from "zod";

export type GetTeamActionResponse = Awaited<ReturnType<typeof getTeamAction>>;

export const getTeamAction = async () => {
  const session = await auth();
  if (!session?.user?.roles?.includes(UserRoles.admin)) {
    throw new Error("Unauthorized");
  }
  const teamList = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      emailVerified: UserTable.emailVerified,
      profilePicture: UserTable.profilePicture,
      createdAt: UserTable.createdAt,
      updatedAt: UserTable.updatedAt,
      roles: sql<UserRoles[]>`array_agg(${UserRoleTable.role})`.as("roles"),
    })
    .from(UserTable)
    .leftJoin(UserRoleTable, eq(UserTable.id, UserRoleTable.userId))
    .where(and(isNotNull(UserRoleTable.role), isNull(UserTable.archivedAt)))
    .groupBy(UserTable.id);
  return {
    team: teamList,
  };
};

export const createTeamMemberAction = async (payload: z.infer<typeof createTeamMemberSchema>) => {
  const session = await auth();

  if (!session?.user?.roles?.includes(UserRoles.admin)) {
    throw new Error("Unauthorized");
  }
  const { success, data, error } = createTeamMemberSchema.safeParse(payload);
  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }
  const encryptedPassword = saltAndHashPassword(data.password);
  const [teamMember] = await db
    .insert(UserTable)
    .values({
      email: data.email,
      name: data.name,
      password: encryptedPassword,
    })
    .returning();
  await db.insert(UserRoleTable).values(data.roles.map((role) => ({ role, userId: teamMember.id })));
  return {
    teamMember,
  };
};

export const updateTeamMemberAction = async (payload: z.infer<typeof updateTeamMemberSchema>) => {
  const session = await auth();

  if (!session?.user?.roles?.includes(UserRoles.admin)) {
    throw new Error("Unauthorized");
  }
  const { success, data, error } = updateTeamMemberSchema.safeParse(payload);
  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  await Promise.all([
    db
      .update(UserTable)
      .set({
        name: data.name,
        email: data.email,
      })
      .where(eq(UserTable.id, data.id)),
    db.delete(UserRoleTable).where(eq(UserRoleTable.userId, data.id)),
  ]);
  await db.insert(UserRoleTable).values(data.roles.map((role) => ({ role, userId: data.id })));
  return {
    success: true,
  };
};

export const deleteTeamMemberAction = async (id: string) => {
  const session = await auth();

  if (!session?.user?.roles?.includes(UserRoles.admin)) {
    throw new Error("Unauthorized");
  }

  await Promise.all([
    db.update(UserTable).set({ archivedAt: new Date() }).where(eq(UserTable.id, id)),
    db.delete(UserRoleTable).where(eq(UserRoleTable.userId, id)),
  ]);
  await db.delete(UserTable).where(eq(UserTable.id, id));
  return {
    success: true,
  };
};
