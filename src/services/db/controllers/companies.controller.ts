import { db } from "@db/conection.js";
import { companies } from "@db/schema.js";
import { v4 as uuid } from "uuid";
import { UploadProfile as getProfilePicture } from "@images-service";
import type { CreateCompanieResult } from "@db/interfaces/companies.interface.js";
import { success, fail } from "@app/types";
import { eq } from "drizzle-orm";
import type { CompanieInput } from "@backend/schemas/company.schema.js";

export class CompaniesController {
  static async isRfcPresent(rfc: string) {
    const results = await db
      .select()
      .from(companies)
      .where(eq(companies.rfc, rfc));
    return results.length > 0;
  }
  static async create(companie: CompanieInput): CreateCompanieResult {
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
  async checkValidation() {}
}
