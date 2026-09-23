import { pgTable, uuid, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { DEFAULT_ALT } from "../const.ts";
import { users } from "./users.model.ts";
import type { ImageDBMetadata } from "@db/interfaces.js";

export const images = pgTable("images", {
  id: uuid().primaryKey(),
  alt: varchar({ length: 150 }).default(DEFAULT_ALT),
  width: integer().notNull(),
  height: integer().notNull(),
  user_id: uuid()
    .references(() => users.id)
    .notNull(),
  url: varchar({ length: 2000 }).notNull(),
  description: varchar({ length: 200 }).default("Empty descrition"),
  hash: varchar({ length: 166 }),
  metadata: jsonb().$type<ImageDBMetadata>().default({}),
});
