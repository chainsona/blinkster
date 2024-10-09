import { NextResponse } from "next/server";
import { ActionExtended } from "@/types";
import { ActionsSpecGetResponse, LinkedAction } from "@dialectlabs/blinks";

export async function GET() {
  let actions: { [key: string]: ActionExtended } = {};

  // Fetch from Turso database
  const { createClient } = await import("@libsql/client");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute(
      `SELECT * FROM action WHERE name != ""`
    );

    for (const row of result.rows) {
      const action: ActionExtended = {
        id: row.id as string,
        providerId: row.provider_id as string,
        name: row.name as string,
        description: row.description as string,
        pathPattern: row.path_pattern as string,
        apiPath: row.api_path as string,
        actionUrl: row.action_url as string,
        actionData: JSON.parse(
          row.action_data as string
        ) as ActionsSpecGetResponse,
        actionParams: JSON.parse(row.action_params as string) as LinkedAction[],
        createdAt: row.created_at as string,
      };

      actions[row.id as string] = action;
    }
  } catch (error) {
    console.error("Error fetching actions from Turso:", error);
    return NextResponse.json(
      { error: "Failed to fetch actions" },
      { status: 500 }
    );
  }

  return NextResponse.json(actions);
}
