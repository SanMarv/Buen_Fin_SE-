import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { locations } from "./locations.model.ts";
import { companies } from "./companies.model.ts";

export const jobs = pgTable("jobs", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  location_id: uuid().references(() => locations.id),
  company_id: uuid()
    .references(() => companies.id)
    .notNull(),
});
