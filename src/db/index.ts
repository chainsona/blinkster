import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { Account } from "@/db/schema/account";
import { Whitelist } from "./schema/whitelist";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso, {
  schema: {
    account: Account,
    whitelist: Whitelist,
  },
});
