import { pgTable, uuid, serial } from "drizzle-orm/pg-core";
import { products } from "./products.model.ts";
import { categories } from "./categories.model.ts";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";
export const category_product = pgTable(TABLE_NAMES.CATEGORY_PRODUCT, {
  id: uuid().primaryKey().notNull(),
  product_id: uuid()
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  category_id: serial()
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
});

export type CategoriesProductsRecord = InferInsertModel<
  typeof category_product
>;
