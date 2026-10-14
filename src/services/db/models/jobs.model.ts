import { pgTable, uuid, varchar, serial } from "drizzle-orm/pg-core";
import { locations } from "./locations.model.ts";
import { companies } from "./companies.model.ts";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";
import { visibilityEnum } from "@db/enums.js";

export const jobs = pgTable(TABLE_NAMES.JOBS, {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  visibility: visibilityEnum().default("PRIVATE").notNull(),
  location_id: serial().references(() => locations.id, {
    onDelete: "cascade",
  }),
  company_id: uuid()
    .references(() => companies.id)
    .notNull(),
});

export type jobsRecord = InferInsertModel<typeof jobs>;
