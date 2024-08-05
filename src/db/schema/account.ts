import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Account = sqliteTable("account", {
  username: text("username").primaryKey(),
  publicKey: text("public_key"),
  createdAt: integer("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  status: text("status", {
    enum: ["unverified", "verified", "blocked"],
  }).default("unverified"),
});