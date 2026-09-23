import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { companies } from "./companies.model.ts";
import { wishlists } from "./wishlist.model.ts";
import { images } from "./image.model.ts";
import { TABLE_NAMES } from "@db/const.ts";

export const users = pgTable(TABLE_NAMES.USERS, {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 200 }).notNull(),
  password: varchar({ length: 200 }).notNull(),
});
