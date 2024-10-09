// import { and, eq } from "drizzle-orm";
import * as jwt from "jsonwebtoken";
// import { PublicKey } from "@solana/web3.js";

// import { db } from "@/db";
// import { AccountRole } from "@/db/schema/account";

export function extractSession(token: any) {
  if (!token) {
    return null;
  }

  let session = null;
  try {
    session = jwt.verify(
      token,
      process.env.JWT_SECRET || "thouShaltNotPass"
    ) as {
      sub: string;
      exp: number;
      role: string;
    };
  } catch (error) {
    return null;
  }

  return session;
}

// export async function verifyAccount(
//   publicKey: PublicKey
// ): Promise<string | undefined> {
//   const authorizedAccounts = await db
//     .select({
//       publicKey: AccountRole.publicKey,
//       role: AccountRole.role,
//     })
//     .from(AccountRole)
//     .where(
//       and(
//         eq(AccountRole.publicKey, publicKey.toBase58()),
//         eq(AccountRole.enabled, true)
//       )
//     );

//   const i = authorizedAccounts
//     .map((accountRole) => accountRole.publicKey)
//     .indexOf(publicKey.toBase58());

//   // Authorize if account is found with a role
//   if (i >= 0) {
//     return authorizedAccounts[i].role;
//   }

//   return undefined;
// }
