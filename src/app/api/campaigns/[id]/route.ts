import { NextResponse } from "next/server";
import { Campaign } from "@/types";
import { campaigns, campaigns as mockCampaigns } from "@/app/api/data_mock";

const IS_MOCK = true;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let campaigns: Campaign | null = null;

  if (IS_MOCK) {
    campaigns = mockCampaigns.find((c) => c.id === params.id) || null;
    if (!campaigns) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(campaigns);
  }

  // Fetch from Turso database
  const { createClient } = await import("@libsql/client");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute({
      sql: "SELECT * FROM campaigns WHERE id = ?",
      args: [params.id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    campaigns = {
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
  } catch (error) {
    console.error("Error fetching campaign from Turso:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }

  return NextResponse.json(campaigns);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (IS_MOCK) {
    const data = await request.json();
    const campaignIndex = mockCampaigns.findIndex((c) => c.id === params.id);
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }
    const updatedCampaign = { ...campaigns[campaignIndex], ...data };
    campaigns[campaignIndex] = updatedCampaign;
    return NextResponse.json(updatedCampaign);
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
        UPDATE campaigns
        SET name = ?, description = ?, imageUrl = ?, status = ?, startDate = ?, endDate = ?, updatedAt = ?
        WHERE id = ?
        RETURNING *
      `,
      args: [
        data.name,
        data.description,
        data.imageUrl,
        data.status,
        data.startDate,
        data.endDate,
        new Date().toISOString(),
        params.id,
      ],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const updatedCampaign = result.rows[0];
    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error("Failed to update campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const IS_MOCK = true;

  if (IS_MOCK) {
    const campaignIndex = campaigns.findIndex((c) => c.id === params.id);
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }
    campaigns[campaignIndex].status = "deleted";
    return NextResponse.json({
      message: "Campaign status set to deleted successfully",
    });
  }

  const { createClient } = await import("@libsql/client");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute({
      sql: "UPDATE campaigns SET status = 'deleted', updatedAt = ? WHERE id = ?",
      args: [new Date().toISOString(), params.id],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Campaign status set to deleted successfully",
    });
  } catch (error) {
    console.error("Failed to update campaign status:", error);
    return NextResponse.json(
      { error: "Failed to update campaign status" },
      { status: 500 }
    );
  }
}
