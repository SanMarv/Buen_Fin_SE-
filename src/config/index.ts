import { ConfigSchema } from "./env.schema.ts";

process.loadEnvFile();
export const env = ConfigSchema.parse(process.env);
