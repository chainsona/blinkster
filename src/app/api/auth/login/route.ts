import { and, eq } from "drizzle-orm";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

import { db } from "@/db";
// import { Account, AccountConnection } from "@/db/schema/account";
// import { verifyAccount } from "@/lib/auth";

export async function POST(request: Request) {
  // Get the public key from the payload
  const { publicKey, message, signature } = await request.json();

  // Check if the public key, message, and signature are present
  let missingAttributes = [];

  if (!publicKey) {
    missingAttributes.push("publicKey");
  }

  if (!message) {
    missingAttributes.push("message");
  }

  if (!signature) {
    missingAttributes.push("signature");
  }

  if (missingAttributes.length) {
    return Response.json(
      { error: `Missing attributes: ${missingAttributes.join(", ")}` },
      { status: 400 }
    );
  }

  // Verify the signature
  let result = false;
  try {
    result = nacl.sign.detached.verify(
      Uint8Array.from(Object.values(message)),
      Uint8Array.from(
        Object.values(signature?.data ? signature.data : signature)
      ),
      new PublicKey(publicKey).toBytes()
    );
  } catch (error) {
    console.error(error);
  }

  if (!result) {
    return Response.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 }
    );
  }

  //   // Create the wallet account, if not exists
  //   const accounts = await db
  //     .select()
  //     .from(Account)
  //     .where(eq(Account.publicKey, publicKey));
  //   if (accounts.length === 0) {
  //     await db.insert(Account).values({
  //       publicKey,
  //     });
  //   }

  //   // Fetch the role of the account
  const role = "user"; // (await verifyAccount(new PublicKey(publicKey))); // TODO: Add this || "user";

  //   if (!role) {
  //     // Unauthorize if the account has no role
  //     return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  //   }

  // Generate JWT token
  const token = jwt.sign(
    { sub: publicKey, role },
    process.env.JWT_SECRET || "thouShaltNotPass",
    {
      expiresIn: process.env.JWT_EXPIRATION || "1h",
    }
  );

  // Set the token in the cookie
  cookies().set("access_token", token, {
    maxAge: 60 * 60 * 24,
  });

  //   await db.insert(AccountConnection).values({
  //     publicKey,
  //   });

  return Response.json({
    data: {
      publicKey,
    },
  });
}
