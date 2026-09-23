import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";

export const locations = pgTable(TABLE_NAMES.LOCATIONS, {
  id: uuid().primaryKey().notNull(),
  city: varchar({ length: 200 }).notNull(),
  colony: varchar({ length: 200 }).notNull(),
});
