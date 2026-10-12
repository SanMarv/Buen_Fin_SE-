import { DEFAULT_DESCRIPTION, TABLE_NAMES } from "@db/const.js";
import { pgTable, uuid, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import type { ProductMetadata } from "../interfaces/images.interfaces.ts";
import { companies } from "./companies.model.ts";
import type { InferInsertModel } from "drizzle-orm";

export const products = pgTable(TABLE_NAMES.PRODUCTS, {
  id: uuid().primaryKey(),
  name: varchar({ length: 200 }).notNull(),
  description: varchar({ length: 200 }).default(DEFAULT_DESCRIPTION),
  price: integer().notNull(),
  metadata: jsonb().$type<ProductMetadata>().default({}),
  company_id: uuid()
    .references(() => companies.id)
    .notNull(),
});

export type ProductsRecord = InferInsertModel<typeof products>
