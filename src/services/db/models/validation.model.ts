import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm/relations";
import { companies } from "./companies.model.ts";
import { TABLE_NAMES } from "@db/const.ts";

export const validation_table = pgTable(TABLE_NAMES.VALIDATION, {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  valid_until: date().notNull(),
  hash: text().notNull(),
  signature: text().notNull(),
});
