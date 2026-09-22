import { ConfigSchema } from "./schema.ts";

process.loadEnvFile();
export const env = ConfigSchema.parse(process.env);
