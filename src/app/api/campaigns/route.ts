import { NextResponse } from "next/server";
import { Campaign } from "@/types";
import { campaigns as mockCampaigns } from "@/app/api/data_mock";

const IS_MOCK = true;

export async function GET() {
  let campaigns: Campaign[] = [];

  if (IS_MOCK) {
    campaigns = mockCampaigns;
    return NextResponse.json(campaigns);
  }

  // Fetch from Turso database
  const { createClient } = await import("@libsql/client");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute("SELECT * FROM campaigns");

    for (const row of result.rows) {
      const campaign: Campaign = {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        imageUrl: row.imageUrl as string,
        status: row.status as string,
        startDate: new Date(row.startDate as string),
        endDate: new Date(row.endDate as string),
        createdAt: new Date(row.createdAt as string),
        updatedAt: new Date(row.updatedAt as string),
      };

      campaigns.push(campaign);
    }
  } catch (error) {
    console.error("Error fetching campaigns from Turso:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }

  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  if (IS_MOCK) {
    const data = await request.json();
    const newCampaign: Campaign = {
      ...data,
      id: (mockCampaigns.length + 1).toString(),
      slug: (data.name as string).toLowerCase().replace(/ /g, "-"),
      createdAt: new Date(),
      updatedAt: new Date(),
      dailyData: [], // Add this line to include the dailyData property
    };
    mockCampaigns.push(newCampaign as any); // Use type assertion to avoid TypeScript error
    return NextResponse.json(newCampaign, { status: 201 });
  }

  const { createClient } = await import("@libsql/client");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const data = await request.json();
    const result = await client.execute({
      sql: `
        INSERT INTO campaigns (name, description, imageUrl, status, startDate, endDate)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *
      `,
      args: [
        data.name,
        data.description,
        data.imageUrl,
        data.status,
        data.startDate,
        data.endDate,
      ],
    });

    const newCampaign = result.rows[0];
    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
