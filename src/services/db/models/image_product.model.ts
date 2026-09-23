import { pgTable, uuid } from "drizzle-orm/pg-core";
import { products } from "./products.model.ts";
import { images } from "./image.model.ts";
import { TABLE_NAMES } from "@db/const.js";

export const imageProducts = pgTable(TABLE_NAMES.IMAGE_PRODUCTS, {
  id: uuid().primaryKey().notNull(),
  product_id: uuid()
    .references(() => products.id)
    .notNull(),
  image_id: uuid()
    .references(() => images.id)
    .notNull(),
});
