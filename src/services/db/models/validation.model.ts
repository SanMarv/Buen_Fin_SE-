import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const validation_table = pgTable("validation", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  RFC: varchar({ length: 13 }).notNull(),
  valid_until: date().notNull(),
  hash: text().notNull(),
  signature: text().notNull(),
});
