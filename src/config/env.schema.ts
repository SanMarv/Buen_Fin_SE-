import z from "zod";
import { DEFAULT_CONFIG } from "./app.const.ts";

const {
  DB_DIALECT,
  DEFAULT_DB_PORT,
  MINIMUM_DB_NAME_SIZE,
  MINIMUM_PASSWORD_SIZE,
  BACKEND_DEFAULT_PORT,
} = DEFAULT_CONFIG;

// TODO: assign real params for propper key
const server_password = z.string().min(MINIMUM_PASSWORD_SIZE);

export const ConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  BACKEND_PORT: z.number().min(0).max(65_535).default(BACKEND_DEFAULT_PORT),
  DB_NAME: z.string().min(MINIMUM_DB_NAME_SIZE),
  DB_PASSWORD: z.string().min(MINIMUM_PASSWORD_SIZE),
  DB_PORT: z.coerce.number().default(DEFAULT_DB_PORT),
  DB_USER: z.string().default(DB_DIALECT),
  DB_HOST: z.string(),
  DB_URL: z.url(),
  JWT_KEY: server_password,
  HMAC_KEY: server_password,
});
export type Config = z.infer<typeof ConfigSchema>;
