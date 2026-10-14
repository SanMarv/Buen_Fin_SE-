import { CATEGORIES } from "@lib/types/categories.js";
import { pgEnum } from "drizzle-orm/pg-core";

export const visibilityValues = ["PUBLIC", "PRIVATE", "SUSPENDED"] as const;

export type VisibilityValue = (typeof visibilityValues)[number];

export const VISIBILITY = {
  public: visibilityValues[0],
  private: visibilityValues[1],
  suspended: visibilityValues[2],
} as const;

export const visibilityEnum = pgEnum("visibility", visibilityValues);
export const categoryEnum = pgEnum("category", CATEGORIES);
