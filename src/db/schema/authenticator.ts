import {} from "drizzle-orm/mysql-core";
import { boolean, integer, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const authenticatorTable = pgTable(
  "authenticator",
  {
    credentialID: text("credential_id").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    providerAccountId: text("provider_Account_id").notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credential_device_type").notNull(),
    credentialBackedUp: boolean("credential_backedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
