import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products.model.ts";
import { categories } from "./category.model";

export const category_product = pgTable("category_product", {
  id: uuid().primaryKey().notNull(),
  product_id: uuid()
    .references(() => products.id)
    .notNull(),
  category_id: uuid()
    .references(() => categories.id)
    .notNull(),
});
