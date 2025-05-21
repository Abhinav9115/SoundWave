import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql", // Changed 'driver: "pg"' to 'dialect: "postgresql"'
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Changed 'connectionString' to 'url' as it's more common for pg
  },
  verbose: true,
  strict: true,
} satisfies Config;
