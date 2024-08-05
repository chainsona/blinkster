import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Whitelist = sqliteTable("whitelist", {
  publicKey: text("public_key").notNull(),
  price: integer("price").notNull(),
  signature: text("signature"),
  status: text("status", {
    enum: ["unverified", "verified", "blocked"],
  }).default("unverified"),

  createdAt: integer("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  expiresAt: integer("expires_at"),
  startsAt: integer("starts_at"),
  updatedAt: integer("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
