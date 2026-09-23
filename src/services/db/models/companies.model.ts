import { pgTable, varchar, uuid, date, integer } from "drizzle-orm/pg-core";
import { users } from "./users.model.ts";
import { validation_table } from "./validation.model.ts";
import { defineRelations } from "drizzle-orm";
import { products } from "./products.model.ts";
import { premises } from "./premises.model.ts";
import { jobs } from "./jobs.model.ts";
import { TABLE_NAMES } from "@db/const.ts";

export const companies = pgTable(TABLE_NAMES.COMPANIES, {
  id: uuid("id").primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  RFC: varchar({ length: 13 }).notNull(),
  validation_id: integer().references(() => validation_table.id),
});
