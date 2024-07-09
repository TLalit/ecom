import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters";
import { and, eq, isNull, sql } from "drizzle-orm";
import { PgDatabase, QueryResultHKT } from "drizzle-orm/pg-core";
import { DefaultSession } from "next-auth";
import {
  TSelectUser,
  accountTable,
  authenticatorTable,
  sessionTable,
  userRoleTable,
  userTable,
  verificationTokenTable,
} from "./db/schema";
import { getFirst } from "./lib/array.helpers";
const selectRoles = sql<
  string[]
>`COALESCE(json_agg(role) FILTER (WHERE user_role.role IS NOT NULL), '[]')`;
export function authAdapter(client: PgDatabase<QueryResultHKT, any>): Adapter {
  return {
    async createUser(data: AdapterUser) {
      const res = await client
        .insert(userTable)
        .values({
          email: data.email,
          name: data.name ?? null,
          profilePicture: data?.image,
        })
        .returning()
        .then((res) => res[0]);
      return res;
    },
    async getUser(userId: string) {
      return await getFirst(
        client
          .select({
            id: userTable.id,
            name: userTable.name,
            email: userTable.email,
            password: userTable.password,
            profilePicture: userTable.profilePicture,
            roles: selectRoles,
            emailVerified: userTable.emailVerified,
            createdAt: userTable.createdAt,
            updatedAt: userTable.updatedAt,
            archivedAt: userTable.archivedAt,
          })
          .from(userTable)
          .leftJoin(userRoleTable, eq(userTable.id, userRoleTable.userId))
          .where(eq(userTable.id, userId))
          .groupBy(userTable.id),
      );
    },
    async getUserByEmail(email: string) {
      return getFirst(
        client
          .select({
            id: userTable.id,
            name: userTable.name,
            email: userTable.email,
            password: userTable.password,
            profilePicture: userTable.profilePicture,
            roles: selectRoles,
            emailVerified: userTable.emailVerified,
            createdAt: userTable.createdAt,
            updatedAt: userTable.updatedAt,
            archivedAt: userTable.archivedAt,
          })
          .from(userTable)
          .leftJoin(userRoleTable, eq(userTable.id, userRoleTable.userId))
          .where(eq(userTable.email, email))
          .groupBy(userTable.id),
      );
    },
    async createSession(data: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      const [session] = await client
        .insert(sessionTable)
        .values(data)
        .returning();
      return session;
    },
    async getSessionAndUser(sessionToken: string) {
      const res = await getFirst(
        client
          .select({
            session: sessionTable,
            user: {
              id: userTable.id,
              name: userTable.name,
              email: userTable.email,
              password: userTable.password,
              profilePicture: userTable.profilePicture,
              roles: selectRoles,
              emailVerified: userTable.emailVerified,
              createdAt: userTable.createdAt,
              updatedAt: userTable.updatedAt,
              archivedAt: userTable.archivedAt,
            },
          })
          .from(sessionTable)
          .innerJoin(userTable, eq(userTable.id, sessionTable.userId))
          .leftJoin(userRoleTable, eq(userTable.id, userRoleTable.userId))
          .where(
            and(
              eq(sessionTable.sessionToken, sessionToken),
              isNull(userTable.archivedAt),
            ),
          )
          .groupBy(
            userTable.id,
            sessionTable.sessionToken,
            sessionTable.userId,
            sessionTable.expires,
          ),
      );
      return res;
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.");
      }

      const [result] = await client
        .update(userTable)
        .set(data)
        .where(eq(userTable.id, data.id))
        .returning();

      if (!result) {
        throw new Error("No user found.");
      }

      return result;
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
    ) {
      return client
        .update(sessionTable)
        .set(data)
        .where(eq(sessionTable.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0]);
    },
    async linkAccount(data: AdapterAccount) {
      await client.insert(accountTable).values(data);
    },
    async getUserByAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">,
    ) {
      const result = await client
        .select({
          account: accountTable,
          user: userTable,
        })
        .from(accountTable)
        .innerJoin(userTable, eq(accountTable.userId, userTable.id))
        .where(
          and(
            eq(accountTable.provider, account.provider),
            eq(accountTable.providerAccountId, account.providerAccountId),
          ),
        )
        .then((res) => res[0]);

      return result?.user ?? null;
    },
    async deleteSession(sessionToken: string) {
      await client
        .delete(sessionTable)
        .where(eq(sessionTable.sessionToken, sessionToken));
    },
    async createVerificationToken(data: VerificationToken) {
      return client
        .insert(verificationTokenTable)
        .values(data)
        .returning()
        .then((res) => res[0]);
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      return client
        .delete(verificationTokenTable)
        .where(
          and(
            eq(verificationTokenTable.identifier, params.identifier),
            eq(verificationTokenTable.token, params.token),
          ),
        )
        .returning()
        .then((res) => (res.length > 0 ? res[0] : null));
    },
    async deleteUser(id: string) {
      await client.delete(userTable).where(eq(userTable.id, id));
    },
    async unlinkAccount(
      params: Pick<AdapterAccount, "provider" | "providerAccountId">,
    ) {
      await client
        .delete(accountTable)
        .where(
          and(
            eq(accountTable.provider, params.provider),
            eq(accountTable.providerAccountId, params.providerAccountId),
          ),
        );
    },
    async getAccount(providerAccountId: string, provider: string) {
      return client
        .select()
        .from(accountTable)
        .where(
          and(
            eq(accountTable.provider, provider),
            eq(accountTable.providerAccountId, providerAccountId),
          ),
        )
        .then((res) => res[0] ?? null) as Promise<AdapterAccount | null>;
    },
    async createAuthenticator(data: AdapterAuthenticator) {
      return client
        .insert(authenticatorTable)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null);
    },
    async getAuthenticator(credentialID: string) {
      return client
        .select()
        .from(authenticatorTable)
        .where(eq(authenticatorTable.credentialID, credentialID))
        .then((res) => res[0] ?? null);
    },
    async listAuthenticatorsByUserId(userId: string) {
      return client
        .select()
        .from(authenticatorTable)
        .where(eq(authenticatorTable.userId, userId))
        .then((res) => res);
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const authenticator = await client
        .update(authenticatorTable)
        .set({ counter: newCounter })
        .where(eq(authenticatorTable.credentialID, credentialID))
        .returning()
        .then((res) => res[0]);

      if (!authenticator) throw new Error("Authenticator not found.");

      return authenticator;
    },
  };
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      profilePicture?: string;
      emailVerified?: boolean;
      roles: string[];
    };
  }
}
declare module "@auth/core/adapters" {
  interface AdapterUser extends TSelectUser {}
}
