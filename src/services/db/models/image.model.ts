import { pgTable, uuid, varchar, integer, json } from "drizzle-orm/pg-core";
import { DEFAULT_ALT } from "../const.ts";
import { users } from "./users.model.ts";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";
import type { ImageMetadata } from "../interfaces/images.interfaces.ts";
import { visibilityEnum } from "@db/enums.js";

export const images = pgTable(TABLE_NAMES.IMAGES, {
  id: uuid().primaryKey(),
  alt: varchar({ length: 150 }).default(DEFAULT_ALT).notNull(),
  width: integer().notNull(),
  height: integer().notNull(),
  user_id: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  url: varchar({ length: 2000 }).notNull(),
  path: varchar({ length: 200 }).notNull(),
  hash: varchar({ length: 166 }),
  metadata: json().$type<ImageMetadata>().default({}),
  visibility: visibilityEnum().default("PRIVATE").notNull(),
});

export type ImageRecord = InferInsertModel<typeof images>;
