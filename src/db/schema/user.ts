import { isNull } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const UserTable = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    profilePicture: text("profile_picture"),
    password: text("password"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", {
      withTimezone: true,
    }),
  },
  (userTable) => ({
    index: uniqueIndex().on(userTable.email).where(isNull(userTable.archivedAt)),
  }),
);
export type TSelectUser = typeof UserTable.$inferSelect & { roles?: string[] };
export type TCreateUser = typeof UserTable.$inferInsert;
