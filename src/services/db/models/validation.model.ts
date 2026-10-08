import {
  date,
  pgTable,
  varchar,
  text,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";
import type { InferSelectModel } from "drizzle-orm";

export const validation_table = pgTable(TABLE_NAMES.VALIDATION, {
  id: uuid().defaultRandom().primaryKey(),
  rfc: varchar("RFC", { length: 13 }).notNull(),
  valid_until: date({ mode: "date" }).notNull(),
  hash: varchar({ length: 344 }).notNull(),
  signature: text().notNull(),
  name: text().notNull(),
  isMoral: boolean().notNull().default(false),
});

export type ValidationRecord = InferSelectModel<typeof validation_table>;
