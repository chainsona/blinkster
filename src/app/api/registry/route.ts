import { RegistryResponse } from "@/types";

export async function GET() {
  try {
    const response = await fetch("https://registry.dial.to/v1/list");
    const json: RegistryResponse = await response.json();

    const registeredItems = json.results
      .filter((item) => item.tags?.includes("registered"))
      .map((item) => ({
        actionUrl: item.actionUrl,
        blinkUrl: item.blinkUrl,
        websiteUrl: item.websiteUrl,
        createdAt: item.createdAt,
      }));

    return Response.json({ ok: true, data: registeredItems });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
