import { DEFAULT_DESCRIPTION } from "@db/const.js";
import { pgTable, uuid, varchar, integer, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("produts", {
  id: uuid().primaryKey(),
  name: varchar({ length: 200 }).notNull(),
  description: varchar({ length: 200 }).default(DEFAULT_DESCRIPTION),
  price: integer().notNull(),
});
