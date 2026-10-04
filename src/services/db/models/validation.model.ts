import {
  date,
  integer,
  pgTable,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";

export const validation_table = pgTable(TABLE_NAMES.VALIDATION, {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  valid_until: date({ mode: "date" }).notNull(),
  hash: varchar({ length: 344 }).notNull(),
  signature: text().notNull(),
  name: text().notNull(),
  isMoral: boolean().notNull().default(false),
});

export type ValidationRecord = InferInsertModel<typeof validation_table>;
