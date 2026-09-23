import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { premises } from "./premises.model.ts";
import { jobs } from "./jobs.model.ts";
import { TABLE_NAMES } from "@db/const.ts";

export const locations = pgTable(TABLE_NAMES.LOCATIONS, {
  id: uuid().primaryKey().notNull(),
  city: varchar({ length: 200 }).notNull(),
  colony: varchar({ length: 200 }).notNull(),
});
