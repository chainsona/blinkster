// import { eq } from "drizzle-orm";
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { db } from "@/db";
import { Whitelist } from "@/db/schema/whitelist";

import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);

    const baseHref = new URL(
      `/api/actions/u/orerush/happy-hours`,
      requestUrl.origin
    ).toString();

    const submissions = await db.select().from(Whitelist);
    // .where(eq(Whitelist.status, "verified"));
    console.log(`Submissions: ${submissions.length}`);

    const payload: ActionGetResponse = {
      title: "ORE Rush Happy Hours!",
      icon: new URL("/orerush-mines.png", requestUrl.origin).toString(),
      description:
        "Reserve your spot now. Mine $ORE for 1 hour on super-fast servers! Hurry, spots are limited. 0.05 SOL anti-bot fee, no refunds.",
      label: "Claim",
      links: {
        actions: [
          {
            type: "transaction",
            label: "Claim",
            href: `${baseHref}`,
          },
        ],
      },
      disabled:
        Date.now() >= new Date(1722902400000).getTime() - 1000 * 60 * 10 ||
        submissions.length > 100,
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let fromPubkey: PublicKey;
    try {
      fromPubkey = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "from" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const toPubkey = new PublicKey(DEFAULT_SOL_ADDRESS);
    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("mainnet-beta")
    );

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (DEFAULT_SOL_AMOUNT * LAMPORTS_PER_SOL < minimumBalance) {
      const message = "Not enough SOL to claim";
      return new Response(message, {
        status: 422,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const transaction = new Transaction().add(
      // Set transaction compute units
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 21_000,
      }),
      new TransactionInstruction({
        keys: [{ pubkey: fromPubkey, isSigner: true, isWritable: true }],
        data: Buffer.from("happy-hours", "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      }),
      SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: DEFAULT_SOL_AMOUNT * LAMPORTS_PER_SOL,
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = fromPubkey;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: "See you in the mines! ⛏️",
      },
    });

    try {
      await db.insert(Whitelist).values({
        publicKey: fromPubkey.toBase58(),
        price: DEFAULT_SOL_AMOUNT,
        status: "unverified",
        startsAt: 1722902400000 * 1000, // Tue Aug 06 2024 00:00:00 UTC
        expiresAt: 1722906000000 * 1000, // Tue Aug 06 2024 01:00:00 UTC
      });
    } catch (err) {
      console.log(
        `Faileed to insert ${fromPubkey.toBase58()} (${DEFAULT_SOL_AMOUNT} SOL)`
      );
    }

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
