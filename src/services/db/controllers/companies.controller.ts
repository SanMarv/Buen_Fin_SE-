import { db } from "@db/conection.js";
import { companies, users, validation_table } from "@db/schema.js";
import { v4 as uuid } from "uuid";
import { UploadProfile as getProfilePicture } from "@images-service";
import type {
  CompanyBasicInfo,
  CreateCompanyResult,
} from "@db/interfaces/companies.interface.js";
import {
  success,
  fail,
  type PromiseResult,
  type NoContentResult,
  noContentError,
  successNoContent,
} from "@app/types";
import { and, eq } from "drizzle-orm";
import type { CompanieInput } from "@backend/schemas/company.schema.js";
import type { CompaniesSelectUser } from "@backend/types";
import { COMPANY_ID_KEY } from "@backend/const.js";

export class CompaniesController {
  static async isRfcPresent(rfc: string) {
    const results = await db
      .select()
      .from(companies)
      .where(eq(companies.rfc, rfc));
    return results.length > 0;
  }
  static async create(companie: CompanieInput): CreateCompanyResult {
    const id = uuid();
    const { name, rfc, user_id, validation_id } = companie;
    const {
      success: isInBucket,
      error,
      data,
    } = await getProfilePicture({ user: { id, name } });
    if (!isInBucket) return fail(error);
    const { url } = data;
    try {
      const [record] = await db
        .insert(companies)
        .values({
          id,
          name,
          profile_picture: url,
          rfc,
          user_id,
          validation_id,
        })
        .returning();
      return success(record);
    } catch (e) {
      console.error(e);
      return fail({ status: 500, error: "Error adding record" });
    }
  }
  static async checkOwner(
    companyId: string,
    user_id: string,
  ): PromiseResult<{ id: string }, { status: 404 | 500; error: string }> {
    try {
      const records = await db
        .select({ id: companies.id })
        .from(companies)
        .innerJoin(
          users,
          and(eq(companies.user_id, users.id), eq(users.id, user_id)),
        )
        .where(eq(companies.id, companyId));
      if (records.length <= 0) return fail({ status: 404, error: "No found" });
      return success(records[0]);
    } catch (e) {
      console.error(e);
      return fail({ status: 500, error: "Error while tring to querry" });
    }
  }
  static async getBasicData(
    id: string,
  ): PromiseResult<CompanyBasicInfo, { status: 500 | 404; error: string }> {
    try {
      const [record] = await db
        .select({
          id: companies.id,
          name: companies.name,
          profile_picture: companies.profile_picture,
          rfc: companies.rfc,
        })
        .from(companies)
        .where(eq(companies.id, id));
      if (!record) return fail({ status: 404, error: "Not found record" });
      return success(record);
    } catch (e) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error while querring companies",
      });
    }
  }
  static async updateProfile({
    companyId,
    url,
  }: {
    companyId: string;
    url: string;
  }): Promise<NoContentResult> {
    try {
      const record = await db
        .update(companies)
        .set({ profile_picture: url })
        .where(eq(companies.id, companyId))
        .returning();
      if (record.length <= 0)
        return noContentError({ status: 404, error: "No updated record" });
      return successNoContent();
    } catch (e) {
      console.error(e);
      return noContentError({ status: 500, error: "Unexpeted error" });
    }
  }
  static async getUserCompanies(
    userId: string,
  ): Promise<CompaniesSelectUser[]> {
    try {
      return await db
        .select({
          [COMPANY_ID_KEY]: companies.id,
          name: companies.name,
          profile_picture: companies.profile_picture,
          certification: {
            rfc: validation_table.rfc,
            legal_name: validation_table.name,
            valid_until: validation_table.valid_until,
          },
        })
        .from(companies)
        .where(eq(companies.user_id, userId))
        .leftJoin(
          validation_table,
          eq(companies.validation_id, validation_table.id),
        );
    } catch {
      return [];
    }
  }
}
