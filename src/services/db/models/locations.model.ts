import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const locations = pgTable("locations", {
  id: uuid().primaryKey().notNull(),
  city: varchar({ length: 200 }).notNull(),
  colony: varchar({ length: 200 }).notNull(),
});
