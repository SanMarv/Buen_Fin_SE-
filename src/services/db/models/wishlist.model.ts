import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.model.ts";
import { TABLE_NAMES } from "@db/const.js";

export const wishlists = pgTable(TABLE_NAMES.WISHLISTS, {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
