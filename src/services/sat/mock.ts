import type { ValidateSatSchema, ValidationResult } from "./interfaces.ts";
import { success } from "@app/types";
import { SatValidator } from "./validator.ts";
import { RfcFaker } from "@nodecfdi/rfc";
import { createHash } from "node:crypto";

const addMonthFromNow = () => {
  const now = new Date();
  const start = new Date().setMonth(now.getMonth() + 1);
  return new Date(start);
};
export class SatMockValidatior extends SatValidator {
  static override validate(_: ValidateSatSchema): ValidationResult {
    const rfc = new RfcFaker().mexicanRfc();
    const signed = `${rfc} - John Doe`;
    const hash = createHash("sha256").update(signed).digest("base64");
    return success({ hash, rfc, signed, valid_until: addMonthFromNow() });
  }
}
