import { pgTable, uuid } from "drizzle-orm/pg-core";
import { products } from "./products.model.ts";
import { images } from "./image.model.ts";

export const imageProducts = pgTable("image_products", {
  id: uuid().primaryKey().notNull(),
  product_id: uuid()
    .references(() => products.id)
    .notNull(),
  image_id: uuid()
    .references(() => images.id)
    .notNull(),
});
