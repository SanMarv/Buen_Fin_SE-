import { fail, success } from "@app/types";
import { db } from "@db/conection.js";
import type {
  CompanyOperationResult,
  ValidCompanyInput,
} from "@db/interfaces/validation.interface.js";
import { validation_table } from "@db/schema.js";

export class ValidationController {
  static async insertValidation(
    newValidation: ValidCompanyInput,
  ): CompanyOperationResult {
    try {
      const [validation] = await db
        .insert(validation_table)
        .values(newValidation)
        .returning();
      return success(validation.id);
    } catch (e: unknown) {
      console.error(e);
      return fail({ status: 500, error: "Failed inserting compant" });
    }
  }
}
