import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const SessionTable = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
