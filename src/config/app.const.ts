import type { CookieOptions } from "express";

export const DEFAULT_CONFIG = {
  BACKEND_DEFAULT_PORT: 3001,
  MINIMUM_PASSWORD_SIZE: 4,
  MINIMUM_DB_NAME_SIZE: 4,
  DEFAULT_DB_PORT: 5432,
  DB_DIALECT: "postgres",
} as const;

const DAYS = 1,
  HOURS = 60,
  MILISECONDS = 1000,
  MINUTES = 60;

export const COOKIES_OPTS: CookieOptions = {
  httpOnly: true,
  maxAge: MILISECONDS * MINUTES * HOURS * DAYS,
  sameSite: "lax",
  secure: true,
};
