import { pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";

export const locations = pgTable(TABLE_NAMES.LOCATIONS, {
  id: serial().primaryKey().notNull(),
  city: varchar({ length: 200 }).notNull(),
  state: varchar({ length: 200 }).notNull(),
});
