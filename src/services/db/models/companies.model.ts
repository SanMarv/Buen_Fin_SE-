import { pgTable, varchar, uuid, text } from "drizzle-orm/pg-core";
import { users } from "./users.model.ts";
import { validation_table } from "./validation.model.ts";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";
export const companies = pgTable(TABLE_NAMES.COMPANIES, {
  id: uuid("id").primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  profile_picture: text().notNull(),
  description: varchar({ length: 280 }).notNull().default("Descripción"),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  rfc: varchar("RFC", { length: 13 }).notNull(),
  validation_id: uuid().references(() => validation_table.id),
});

export type CompaniesRecord = InferInsertModel<typeof companies>;
