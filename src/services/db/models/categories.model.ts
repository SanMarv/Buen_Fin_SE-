import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";

export const categories = pgTable(TABLE_NAMES.CATEGORIES, {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});

export type CaregoriesRecord = InferInsertModel<typeof categories>;
