import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { locations } from "./locations.model.ts";
import { companies } from "./companies.model.ts";
import { TABLE_NAMES } from "@db/const.ts";

export const jobs = pgTable(TABLE_NAMES.JOBS, {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  location_id: uuid().references(() => locations.id),
  company_id: uuid()
    .references(() => companies.id)
    .notNull(),
});
