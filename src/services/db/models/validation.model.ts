import { date, integer, pgTable, text } from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";

export const validation_table = pgTable(TABLE_NAMES.VALIDATION, {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  valid_until: date().notNull(),
  hash: text().notNull(),
  signature: text().notNull(),
});
