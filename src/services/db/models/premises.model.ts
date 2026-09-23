import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { companies } from "./companies.model.ts";
import { locations } from "./locations.model.ts";
import { TABLE_NAMES } from "@db/const.js";

export const premises = pgTable(TABLE_NAMES.PREMISES, {
  id: uuid().primaryKey().notNull(),
  contact_number: varchar({ length: 200 }).notNull(),
  location_id: uuid()
    .references(() => locations.id)
    .notNull(),
  entry_schedule: timestamp().notNull(),
  exit_schedule: timestamp().notNull(),
  company_id: uuid()
    .references(() => companies.id)
    .notNull(),
});
