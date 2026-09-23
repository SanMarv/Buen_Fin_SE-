import {
  pgTable,
  integer,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies.model.ts";
import { locations } from "./locations.model.ts";

export const premises = pgTable("premises", {
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
