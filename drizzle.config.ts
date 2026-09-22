import { defineConfig } from "drizzle-kit";
import { env } from "@env";
export default defineConfig({
  dialect: "postgresql",
  schema: "src/services/db/schema.ts",
  dbCredentials: {
    database: env.DB_NAME,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    ssl: false,
  },
});
