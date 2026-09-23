import { pgTable, uuid } from "drizzle-orm/pg-core";
import { wishlists } from "./wishlist.model.ts";
import { products } from "./products.model.ts";

export const wishlistProducts = pgTable("wishlist_products", {
  id: uuid().primaryKey().notNull(),
  wishlist_id: uuid()
    .references(() => wishlists.id)
    .notNull(),
  product_id: uuid()
    .references(() => products.id)
    .notNull(),
});
