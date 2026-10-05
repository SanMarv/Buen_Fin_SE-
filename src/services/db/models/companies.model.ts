import { pgTable, varchar, uuid, integer, text } from "drizzle-orm/pg-core";
import { users } from "./users.model.ts";
import { validation_table } from "./validation.model.ts";
import { TABLE_NAMES } from "@db/const.js";

export const companies = pgTable(TABLE_NAMES.COMPANIES, {
  id: uuid("id").primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  profile_picture: text().notNull(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  rfc: varchar("RFC", { length: 13 }).notNull(),
  validation_id: integer().references(() => validation_table.id),
});
