import { pgTable, uuid } from "drizzle-orm/pg-core";
import { wishlists } from "./wishlist.model.ts";
import { products } from "./products.model.ts";
import { TABLE_NAMES } from "@db/const.js";

export const wishlistProducts = pgTable(TABLE_NAMES.WISHLIST_PRODUCTS, {
  id: uuid().primaryKey().notNull(),
  wishlist_id: uuid()
    .references(() => wishlists.id)
    .notNull(),
  product_id: uuid()
    .references(() => products.id)
    .notNull(),
});
