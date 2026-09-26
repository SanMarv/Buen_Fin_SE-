import z from "zod";
import { DEFAULT_CONFIG } from "./const.ts";

const {
  DB_DIALECT,
  DEFAULT_DB_PORT,
  MINIMUM_DB_NAME_SIZE,
  MINIMUM_PASSWORD_SIZE,
} = DEFAULT_CONFIG;
export const ConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DB_NAME: z.string().min(MINIMUM_DB_NAME_SIZE),
  DB_PASSWORD: z.string().min(MINIMUM_PASSWORD_SIZE),
  DB_PORT: z.coerce.number().default(DEFAULT_DB_PORT),
  DB_USER: z.string().default(DB_DIALECT),
  DB_HOST: z.string(),
  DB_URL: z.url(),
});
export type Config = z.infer<typeof ConfigSchema>;
