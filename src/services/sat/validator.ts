import type {
  ValidateSatSchema,
  ValidationResult,
  PartialSuccessSign,
  SuccessSign,
} from "./interfaces.ts";
import { Credential } from "@nodecfdi/credentials/node";
import { Rfc } from "@nodecfdi/rfc";
import { success, fail } from "@app/types";

export const ERROR_SIGNATURE_MESSAGES = {
  EXPIRED: "EXPIRED_SIGNATURE",
  PROCESSING_ERROR: "ERROR_PROCESSING_CRETENTIALS",
} as const;

export class SatValidator {
  static rfcValidate(rfc: string): boolean {
    return Rfc.isValid(rfc);
  }
  static validate({ cer, key, password }: ValidateSatSchema): ValidationResult {
    let certification: Credential;
    try {
      certification = Credential.create(cer, key, password);
    } catch (e: any) {
      return fail({
        status: 400,
        error: ERROR_SIGNATURE_MESSAGES["PROCESSING_ERROR"],
      });
    }
    const validated = certification.certificate();
    const isExpired = !validated.validOn();
    if (isExpired)
      return fail({ status: 403, error: ERROR_SIGNATURE_MESSAGES["EXPIRED"] });

    const result: PartialSuccessSign = {};

    result["valid_until"] = validated.validTo();
    result["rfc"] = validated.rfc();
    result["signed"] = `${result["rfc"]} - ${validated.name()}`;
    result["hash"] = certification.sign(result["signed"]);

    return success(result as SuccessSign);
  }
}
