import { createClient } from "@libsql/client";
import { ActionRuleObjectExtended } from "@/types";
import winston from "winston";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { ActionsSpecGetResponse } from "@dialectlabs/blinks";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "actions.log" }),
  ],
});

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  try {
    logger.info("Creating action table if not exists");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS action (
        id TEXT PRIMARY KEY,
        provider_id TEXT,
        name TEXT,
        description TEXT,
        path_pattern TEXT,
        api_path TEXT,
        action_url TEXT UNIQUE,
        action_data TEXT,
        action_params TEXT,
        created_at TEXT,
        registration_status TEXT
      )
    `);
    logger.info("Action table created or already exists");
  } catch (error) {
    logger.error("Error creating action table:", error);
    throw new Error("Failed to create action table");
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

    const actionsUrl = `${url.origin}/actions.json`;

    try {
      logger.info(`Fetching actions.json from ${actionsUrl}`);
      const resActionsJson = await fetch(actionsUrl);
      const resActions = await resActionsJson.json();
      const rules: ActionRuleObjectExtended[] = (resActions as any).rules || [];
      logger.info(
        `Successfully fetched ${rules.length} rules from ${actionsUrl}`
      );

      for (const rule of rules) {
        if (!rule.pathPattern || !rule.apiPath) {
          logger.warn(
            `Skipping rule due to missing pathPattern or apiPath: ${JSON.stringify(
              rule
            )}`
          );
          continue;
        }

        const actionPath = `${url.origin}/${rule.apiPath}`;

        let action: ActionsSpecGetResponse | null = null;
        if (!rule.pathPattern.includes("*")) {
          logger.info(`Fetching rule details from ${actionPath}`);
          const resRuleJson = await fetch(actionPath);
          const resRule = await resRuleJson.json();

          action = resRule as ActionsSpecGetResponse;
        }

        const registrationStatus = blink.registrationStatus || "none"; // trusted, untrusted, none

        const actionRule = {
          id: uuidv4(),
          provider_id: url.hostname,
          name: action?.title || "",
          description: action?.description || "",
          path_pattern: rule.pathPattern,
          api_path: rule.apiPath,
          action_url: rule.apiPath.startsWith("/")
            ? `${url.origin}${rule.apiPath}`
            : rule.apiPath,
          action_data: !action ? null : JSON.stringify(action),
          action_params:
            !!action?.links?.actions && action.links.actions.length > 0
              ? JSON.stringify(
                  action.links?.actions.map((a) => ({
                    url: a.href,
                    label: a.label,
                    parameters: a.parameters,
                  }))
                )
              : null,
          created_at: blink.createdAt,
          registration_status: registrationStatus,
        };

        await insertAction(actionRule);
        logger.info(`Successfully inserted action rule: ${actionRule.id}`);
      }
    } catch (error) {
      logger.error(`Error processing blink ${url.hostname}:`, error);
    }
  }

  logger.info("Finished processing all blinks and action rules");
})();

async function insertAction(action: any) {
  try {
    logger.info(`Upserting action rule ${action.id}`);
    const sql = `
      INSERT INTO action (id, provider_id, name, description, path_pattern, api_path, action_url, action_data, action_params, created_at, registration_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(action_url) DO UPDATE SET
      id = COALESCE(excluded.id, id),
      provider_id = COALESCE(excluded.provider_id, provider_id),
      name = COALESCE(excluded.name, name),
      description = COALESCE(excluded.description, description),
      path_pattern = COALESCE(excluded.path_pattern, path_pattern),
      api_path = COALESCE(excluded.api_path, api_path),
      action_data = COALESCE(excluded.action_data, action_data),
      action_params = COALESCE(excluded.action_params, action_params),
      created_at = COALESCE(excluded.created_at, created_at),
      registration_status = COALESCE(excluded.registration_status, registration_status)
    `;
    const args = [
      action.id,
      action.provider_id,
      action.name,
      action.description,
      action.path_pattern,
      action.api_path,
      action.action_url,
      action.action_data,
      action.action_params,
      action.created_at,
      action.registration_status,
    ];
    await client.execute({ sql, args });
    logger.info(
      `Successfully upserted action rule with action_url ${action.action_url}`
    );
  } catch (error) {
    logger.error(
      `Error upserting action rule with action_url ${action.action_url}:`,
      error
    );
  }
}
