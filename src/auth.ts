import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { comparePassword } from "./lib/password";

import { getFirst } from "@/lib/array.helpers";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { authAdapter } from "./auth.adapter";
import { db } from "./db";
import { UserRoleTable, UserTable } from "./db/schema";
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      authorize: async (credentials, req) => {
        const { success, data } = z
          .object({
            email: z.string().email(),
            password: z.string(),
          })
          .safeParse(credentials);
        if (!success) {
          throw new CredentialsSignin();
        }

        const user = await getFirst(
          db
            .select({
              id: UserTable.id,
              name: UserTable.name,
              email: UserTable.email,
              password: UserTable.password,
              profilePicture: UserTable.profilePicture,
              roles: sql<string[]>`json_agg(role)`,
            })
            .from(UserTable)
            .leftJoin(UserRoleTable, eq(UserTable.id, UserRoleTable.userId))
            .where(eq(UserTable.email, data.email))
            .groupBy(UserTable.id),
        );

        if (!user) {
          throw new CredentialsSignin();
        }
        if (!user.password) {
          throw new CredentialsSignin();
        }
        const isPasswordValid = comparePassword(data.password, user.password);
        if (isPasswordValid) {
          return {
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
            id: user.id,
            roles: user.roles?.filter((item) => item),
          };
        } else {
          throw new CredentialsSignin();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 48 * 60 * 60,
  },
  adapter: authAdapter(db),
  callbacks: {
    session: async ({ token, session }) => {
      return {
        user: {
          id: token.id as string,
          roles: token.roles,
          name: token.name,
          email: token.email,
          emailVerified: token.emailVerified,
          profilePicture: token.profilePicture,
        },
        expires: session.expires,
      };
    },
    jwt: async ({ token }) => {
      if (!token?.sub) return null;
      const user = await authAdapter(db).getUser?.(token?.sub);

      return {
        ...token,
        id: user?.id,
        name: user?.name,
        email: user?.email,
        profilePicture: user?.profilePicture,
        roles: user?.roles,
        emailVerified: user?.emailVerified,
      };
    },
  },
});
