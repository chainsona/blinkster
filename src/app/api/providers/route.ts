import { NextResponse } from "next/server";
import { ActionRuleObjectExtended, BlinkProvider } from "@/types";
// import { providersResponse } from "@/lib/blink";

export async function GET() {
  // return NextResponse.json(providersResponse);

  let providers: { [key: string]: BlinkProvider } = {};

  // Fetch from Turso database
  const { createClient } = await import("@libsql/client");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute("SELECT * FROM provider");

    for (const row of result.rows) {
      const provider: BlinkProvider = {
        id: row.id as string,
        name: row.name as string,
        domain: row.domain as string,
        icon: row.icon as string,
        url: row.url as string,
        createdAt: row.createdAt as string | undefined,
        registered: Boolean(row.registered),
        rules: JSON.parse(row.rules as string) as ActionRuleObjectExtended[],
      };

      providers[row.domain as string] = provider;
    }
  } catch (error) {
    console.error("Error fetching providers from Turso:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }

  return NextResponse.json(providers);
}
