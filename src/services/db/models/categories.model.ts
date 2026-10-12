import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";

export const categories = pgTable(TABLE_NAMES.CATEGORIES, {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
});

export type CaregoriesRecord = InferInsertModel<typeof categories>

