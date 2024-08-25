import { and, eq, isNull, sql } from "drizzle-orm";
import { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { DefaultSession } from "next-auth";
import {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import {
  AccountTable,
  AuthenticatorTable,
  SessionTable,
  TSelectUser,
  UserRoleTable,
  UserTable,
  VerificationTokenTable,
} from "./db/schema";
import { getFirst } from "./lib/array.helpers";
const selectRoles = sql<string[]>`COALESCE(json_agg(role) FILTER (WHERE user_role.role IS NOT NULL), '[]')`;
export function authAdapter(client: PgDatabase<PgQueryResultHKT, any>): Adapter {
  return {
    async createUser(data: AdapterUser) {
      const res = await client
        .insert(UserTable)
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
            id: UserTable.id,
            name: UserTable.name,
            email: UserTable.email,
            password: UserTable.password,
            profilePicture: UserTable.profilePicture,
            roles: selectRoles,
            emailVerified: UserTable.emailVerified,
            createdAt: UserTable.createdAt,
            updatedAt: UserTable.updatedAt,
            archivedAt: UserTable.archivedAt,
          })
          .from(UserTable)
          .leftJoin(UserRoleTable, eq(UserTable.id, UserRoleTable.userId))
          .where(eq(UserTable.id, userId))
          .groupBy(UserTable.id),
      );
    },
    async getUserByEmail(email: string) {
      return getFirst(
        client
          .select({
            id: UserTable.id,
            name: UserTable.name,
            email: UserTable.email,
            password: UserTable.password,
            profilePicture: UserTable.profilePicture,
            roles: selectRoles,
            emailVerified: UserTable.emailVerified,
            createdAt: UserTable.createdAt,
            updatedAt: UserTable.updatedAt,
            archivedAt: UserTable.archivedAt,
          })
          .from(UserTable)
          .leftJoin(UserRoleTable, eq(UserTable.id, UserRoleTable.userId))
          .where(eq(UserTable.email, email))
          .groupBy(UserTable.id),
      );
    },
    async createSession(data: { sessionToken: string; userId: string; expires: Date }) {
      const [session] = await client.insert(SessionTable).values(data).returning();
      return session;
    },
    async getSessionAndUser(sessionToken: string) {
      const res = await getFirst(
        client
          .select({
            session: SessionTable,
            user: {
              id: UserTable.id,
              name: UserTable.name,
              email: UserTable.email,
              password: UserTable.password,
              profilePicture: UserTable.profilePicture,
              roles: selectRoles,
              emailVerified: UserTable.emailVerified,
              createdAt: UserTable.createdAt,
              updatedAt: UserTable.updatedAt,
              archivedAt: UserTable.archivedAt,
            },
          })
          .from(SessionTable)
          .innerJoin(UserTable, eq(UserTable.id, SessionTable.userId))
          .leftJoin(UserRoleTable, eq(UserTable.id, UserRoleTable.userId))
          .where(and(eq(SessionTable.sessionToken, sessionToken), isNull(UserTable.archivedAt)))
          .groupBy(UserTable.id, SessionTable.sessionToken, SessionTable.userId, SessionTable.expires),
      );
      return res;
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.");
      }

      const [result] = await client.update(UserTable).set(data).where(eq(UserTable.id, data.id)).returning();

      if (!result) {
        throw new Error("No user found.");
      }

      return result;
    },
    async updateSession(data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      return client
        .update(SessionTable)
        .set(data)
        .where(eq(SessionTable.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0]);
    },
    async linkAccount(data: AdapterAccount) {
      await client.insert(AccountTable).values(data);
    },
    async getUserByAccount(account: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const result = await client
        .select({
          account: AccountTable,
          user: UserTable,
        })
        .from(AccountTable)
        .innerJoin(UserTable, eq(AccountTable.userId, UserTable.id))
        .where(
          and(
            eq(AccountTable.provider, account.provider),
            eq(AccountTable.providerAccountId, account.providerAccountId),
          ),
        )
        .then((res) => res[0]);

      return result?.user ?? null;
    },
    async deleteSession(sessionToken: string) {
      await client.delete(SessionTable).where(eq(SessionTable.sessionToken, sessionToken));
    },
    async createVerificationToken(data: VerificationToken) {
      return client
        .insert(VerificationTokenTable)
        .values(data)
        .returning()
        .then((res) => res[0]);
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      return client
        .delete(VerificationTokenTable)
        .where(
          and(eq(VerificationTokenTable.identifier, params.identifier), eq(VerificationTokenTable.token, params.token)),
        )
        .returning()
        .then((res) => (res.length > 0 ? res[0] : null));
    },
    async deleteUser(id: string) {
      await client.delete(UserTable).where(eq(UserTable.id, id));
    },
    async unlinkAccount(params: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      await client
        .delete(AccountTable)
        .where(
          and(eq(AccountTable.provider, params.provider), eq(AccountTable.providerAccountId, params.providerAccountId)),
        );
    },
    async getAccount(providerAccountId: string, provider: string) {
      return client
        .select()
        .from(AccountTable)
        .where(and(eq(AccountTable.provider, provider), eq(AccountTable.providerAccountId, providerAccountId)))
        .then((res) => res[0] ?? null) as Promise<AdapterAccount | null>;
    },
    async createAuthenticator(data: AdapterAuthenticator) {
      return client
        .insert(AuthenticatorTable)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null);
    },
    async getAuthenticator(credentialID: string) {
      return client
        .select()
        .from(AuthenticatorTable)
        .where(eq(AuthenticatorTable.credentialID, credentialID))
        .then((res) => res[0] ?? null);
    },
    async listAuthenticatorsByUserId(userId: string) {
      return client
        .select()
        .from(AuthenticatorTable)
        .where(eq(AuthenticatorTable.userId, userId))
        .then((res) => res);
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const authenticator = await client
        .update(AuthenticatorTable)
        .set({ counter: newCounter })
        .where(eq(AuthenticatorTable.credentialID, credentialID))
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
declare module "next-auth/adapters" {
  interface AdapterUser extends TSelectUser {}
}
