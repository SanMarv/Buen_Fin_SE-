import type { PromiseResult } from "@app/types";
import type { companies } from "@db/schema.js";
import type { CompanyPageItem } from "@lib/types/company.js";
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

export type CompanyResultById = PromiseResult<
  CompanyPageItem,
  { status: number; error: string }
>;
