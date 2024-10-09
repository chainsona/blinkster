import { providerInfo } from "@/lib/blink";
import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  // Create the provider_info table if it doesn't exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS provider_info (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      icon TEXT NOT NULL,
      url TEXT NOT NULL
    )
  `);

  // Iterate through all providers in providerInfo
  for (const [hostname, provider] of Object.entries(providerInfo)) {
    try {
      const uuid = uuidv4();
      // Insert or update provider info in Turso database
      await client.execute({
        sql: `
          INSERT INTO provider_info (id, name, domain, icon, url)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          domain = excluded.domain,
          icon = excluded.icon,
          url = excluded.url
        `,
        args: [uuid, provider.name, hostname, provider.icon, provider.url],
      });
      console.log(`Successfully upserted provider info for ${hostname}`);
    } catch (error) {
      console.error(`Error upserting provider info for ${hostname}:`, error);
    }
  }

  console.log('Finished updating provider info in Turso database');
})();
