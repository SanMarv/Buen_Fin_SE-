import type { PromiseResult } from "@app/types";
import type { companies } from "@db/schema.js";
import type { InferSelectModel } from "drizzle-orm";

type CompanyRecord = InferSelectModel<typeof companies>;

export type CreateCompanyResult = PromiseResult<
  CompanyRecord,
  { error: string; status: number }
>;

export type CompanyBasicInfo = Pick<
  CompanyRecord,
  "id" | "name" | "profile_picture" | "rfc"
>;
