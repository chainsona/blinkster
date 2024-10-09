import { createClient } from "@libsql/client";
import { BlinkProvider, ActionRuleObjectExtended } from "@/types";
import winston from "winston";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "providers.log" }),
  ],
});

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function getIconFromMetadata(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Check for favicon
    const favicon =
      document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="icon"]');
    if (favicon && favicon.getAttribute("href")) {
      return new URL(favicon.getAttribute("href")!, url).href;
    }

    // Check for Apple touch icon
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleIcon && appleIcon.getAttribute("href")) {
      return new URL(appleIcon.getAttribute("href")!, url).href;
    }

    // Check for Open Graph image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && ogImage.getAttribute("content")) {
      return ogImage.getAttribute("content")!;
    }

    return null;
  } catch (error) {
    logger.error(`Error fetching icon from metadata for ${url}:`, error);
    return null;
  }
}

async function getWebsiteNameFromMetadata(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Check for Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && ogTitle.getAttribute("content")) {
      return ogTitle.getAttribute("content")!;
    }

    // Check for title tag
    const titleTag = document.querySelector("title");
    if (titleTag && titleTag.textContent) {
      return titleTag.textContent.trim();
    }

    return null;
  } catch (error) {
    logger.error(
      `Error fetching website name from metadata for ${url}:`,
      error
    );
    return null;
  }
}

(async () => {
  try {
    logger.info("Creating providers table if not exists");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS provider (
        id TEXT PRIMARY KEY,
        name TEXT,
        domain TEXT,
        icon TEXT,
        url TEXT,
        createdAt TEXT,
        registered INTEGER,
        rules TEXT
      )
    `);
    logger.info("Providers table created or already exists");

    // Create provider_info table if not exists
    await client.execute(`
      CREATE TABLE IF NOT EXISTS provider_info (
        domain TEXT PRIMARY KEY,
        name TEXT,
        icon TEXT
      )
    `);
    logger.info("Provider_info table created or already exists");
  } catch (error) {
    logger.error("Error creating tables:", error);
    throw new Error("Failed to create tables");
  }

  let blinks: any;

  try {
    logger.info("Fetching blinks from registry");
    const response = await fetch("https://registry.dial.to/v1/list");
    const data = await response.json();
    blinks = (data as any)?.results;
    logger.info(`Successfully fetched ${blinks.length} blinks from registry`);
  } catch (error) {
    logger.error("Error fetching blinks from registry:", error);
    throw new Error("Failed to fetch blinks from registry");
  }

  if (!blinks || !Array.isArray(blinks)) {
    logger.error("Invalid response from registry");
    throw new Error("Invalid response from registry");
  }

  const providers: { [key: string]: BlinkProvider } = {};
  const actions: string[] = [];

  blinks.sort((a, b) => b.createdAt - a.createdAt);

  const batchSize = 10;
  const providerBatch: BlinkProvider[] = [];

  for (const blink of blinks) {
    let url: URL | null = new URL(
      blink.websiteUrl || blink.blinkUrl || blink.actionUrl
    );

    if (!url) {
      logger.warn(
        `Skipping blink due to invalid URL: ${JSON.stringify(blink)}`
      );
      continue;
    }

    const name = await getWebsiteNameFromMetadata(url.origin);
    logger.info(`Fetched website name from metadata for ${url.hostname}: ${name}`);

    const icon = await getIconFromMetadata(url.origin);
    logger.info(`Fetched icon from metadata for ${url.hostname}: ${icon}`);

    continue;


    // actions.push(blink.actionUrl);
    // const actionsUrl = `${url.origin}/actions.json`;

    // let rules: ActionRuleObjectExtended[] = [];
    // try {
    //   logger.info(`Fetching actions.json from ${actionsUrl}`);
    //   const resActionsJson = await fetch(actionsUrl);
    //   const resActions = await resActionsJson.json();
    //   rules = (resActions as any).rules || [];
    //   logger.info(
    //     `Successfully fetched ${rules.length} rules from ${actionsUrl}`
    //   );
    // } catch (error) {
    //   logger.error(`Error fetching actions.json from ${actionsUrl}:`, error);
    // }

    // for (let i = 0; i < rules.length; i++) {
    //   try {
    //     const rule = rules[i];

    //     if (!rule.pathPattern || !rule.apiPath) {
    //       logger.warn(
    //         `Skipping rule due to missing pathPattern or apiPath: ${JSON.stringify(
    //           rule
    //         )}`
    //       );
    //       continue;
    //     }

    //     if ((rule.pathPattern as string)?.includes("*")) {
    //       logger.warn(
    //         `Skipping rule due to wildcard in pathPattern: ${JSON.stringify(
    //           rule
    //         )}`
    //       );
    //       continue;
    //     }

    //     const actionPath = `${url.origin}/${rule.apiPath}`;
    //     logger.info(`Fetching rule details from ${actionPath}`);
    //     const resRuleJson = await fetch(actionPath);
    //     const resRule = await resRuleJson.json();
    //     rules[i] = {
    //       ...rule,
    //       actionData: resRule,
    //       actionUrl: `${url.origin}/${rule.apiPath}`,
    //     };
    //     logger.info(`Successfully expanded rule: ${rule.apiPath}`);
    //   } catch (error) {
    //     logger.error(
    //       `Error fetching or expanding rule: ${rules[i].apiPath}`,
    //       error
    //     );
    //   }
    // }

    // // Fetch provider info from provider_info table
    // let providerInfoFromDB;
    // try {
    //   const result = await client.execute({
    //     sql: "SELECT name, icon FROM provider_info WHERE domain = ?",
    //     args: [url.hostname],
    //   });
    //   providerInfoFromDB = result.rows[0];
    // } catch (error) {
    //   logger.error(`Error fetching provider info for ${url.hostname}:`, error);
    // }

    // // Try to get icon from website metadata
    // let icon = String(providerInfoFromDB?.icon) || "";
    // if (!icon) {
    //   icon = (await getIconFromMetadata(url.origin)) || "";
    //   logger.info(`Fetched icon from metadata for ${url.hostname}: ${icon}`);
    // }

    // // Try to get website name from metadata
    // let name = String(providerInfoFromDB?.name) || null;
    // if (!name) {
    //   name = (await getWebsiteNameFromMetadata(url.origin)) || url.origin;
    //   logger.info(
    //     `Fetched website name from metadata for ${url.hostname}: ${name}`
    //   );
    // }

    // const provider: BlinkProvider = {
    //   id: url.hostname,
    //   name,
    //   domain: url.hostname,
    //   icon,
    //   url: url.origin,
    //   createdAt: blink.createdAt,
    //   registered: blink.tags?.includes("registered"),
    //   rules,
    // };

    // providers[url.hostname] = provider;
    // providerBatch.push(provider);

    // if (providerBatch.length >= batchSize) {
    //   await insertProviderBatch(providerBatch);
    //   providerBatch.length = 0;
    // }
  }

  // Insert any remaining providers
  if (providerBatch.length > 0) {
    await insertProviderBatch(providerBatch);
  }

  logger.info("Finished processing all blinks and providers");
})();

async function insertProviderBatch(batch: BlinkProvider[]) {
  try {
    logger.info(
      `Inserting or updating batch of ${batch.length} providers in Turso database`
    );
    const sql = `
      INSERT INTO provider (id, name, domain, icon, url, createdAt, registered, rules)
      VALUES ${batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ")}
      ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      domain = excluded.domain,
      icon = excluded.icon,
      url = excluded.url,
      createdAt = excluded.createdAt,
      registered = excluded.registered,
      rules = excluded.rules
    `;
    const args = batch.flatMap((provider) => [
      provider.id,
      provider.name ?? "NULL",
      provider.domain ?? "NULL",
      provider.icon ?? "NULL",
      provider.url ?? "NULL",
      provider.createdAt ?? "NULL",
      provider.registered ? 1 : 0,
      provider.rules ? JSON.stringify(provider.rules) : "NULL",
    ]);
    await client.execute({ sql, args });
    logger.info(
      `Successfully inserted or updated batch of ${batch.length} providers in Turso database`
    );
  } catch (error) {
    logger.error(
      `Error inserting or updating batch of providers in Turso database:`,
      error
    );
  }
}
