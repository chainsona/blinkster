/**
 * Solana Actions Example
 */

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
import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);

    const baseHref = new URL(
      `/api/actions/signup`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      title: "Become a Blinkster",
      icon: new URL("/blinkster.png", requestUrl.origin).toString(),
      description:
        "No-code tool to create custom Blinks from top Solana protocols effortlessly.",
      label: "Sign up",
      links: {
        actions: [
          {
            label: "Sign up",
            href: `${baseHref}?username={username}`,
            parameters: [
              {
                name: "username", // parameter username in the `href` above
                label: "Username",
                required: true,
              },
            ],
          },
        ],
      },
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
    const { username } = validatedQueryParams(requestUrl);

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
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    const transaction = new Transaction();

    transaction.add(
      // Set transaction compute units
      // ComputeBudgetProgram.setComputeUnitLimit({
      //   units: 800,
      // }),
      new TransactionInstruction({
        keys: [{ pubkey: fromPubkey, isSigner: true, isWritable: true }],
        data: Buffer.from(username, "utf-8"),
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

    // TODO: create user
    console.log(username);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Welcome to Blinkster, ${username}!`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

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

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
  let username: string = "";

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("username")) {
      username = requestUrl.searchParams.get("username")!;
    }

    if (!!!username) throw "username is invalid";
  } catch (err) {
    throw "Invalid input query parameter: username";
  }

  return {
    username,
    toPubkey,
  };
}
