import type { ValidateSatSchema, ValidationResult } from "./interfaces.ts";
import { Credential, PrivateKey } from "@nodecfdi/credentials/node";
import { Rfc } from "@nodecfdi/rfc";
import { success, fail, type Result } from "@app/types";
import { Certificate } from "@nodecfdi/credentials/browser";
import { constract } from "./contract.ts";

export const ERROR_SIGNATURE_MESSAGES = {
  EXPIRED: "EXPIRED_SIGNATURE",
  PROCESSING_ERROR: "ERROR_PROCESSING_CRETENTIALS",
} as const;

export class SatValidator {
  static rfcValidate(rfc: string): boolean {
    return Rfc.isValid(rfc);
  }
  private cer: Buffer;
  private key: Buffer;
  private password: string;
  constructor({ cer, key, password }: ValidateSatSchema) {
    this.cer = cer;
    this.key = key;
    this.password = password;
  }
  private validateCertification(): Result<Certificate, { error: string }> {
    let cerString;
    try {
      cerString = this.cer.toString("binary");
    } catch {
      return fail({ error: "Error parsing certification" });
    }
    let result: Certificate;
    try {
      result = new Certificate(cerString);
    } catch {
      return fail({ error: "Error validating binary data" });
    }
    return success(result);
  }
  private validatePrivateKey(): Result<PrivateKey, { error: string }> {
    let privateStr;
    try {
      privateStr = this.key.toString("binary");
    } catch {
      return fail({ error: "Error parsing certification" });
    }
    let result: PrivateKey;
    try {
      result = new PrivateKey(privateStr, this.password);
    } catch {
      return fail({ error: "Error validating binary data" });
    }
    return success(result);
  }
  private parseResult(
    credential: Credential,
  ): NonNullable<ValidationResult["data"]> {
    const rfc = credential.rfc();
    const name = credential.legalName();
    const signed = constract({ rfc, name });
    // hash generation
    const binary = Buffer.from(signed).toString("latin1");
    const rawHash = credential.sign(binary, "sha256");
    const hashBase64 = Buffer.from(rawHash, "binary").toString("base64");
    // result
    return {
      hash: hashBase64,
      rfc,
      signature: signed,
      name,
      valid_until: credential.certificate().validTo(),
      isMoral: Rfc.parse(rfc).isMoral(),
    };
  }
  validate(): ValidationResult {
    const {
      success: cerIsValid,
      data: cerFile,
      error: cerError,
    } = this.validateCertification();
    if (!cerIsValid) return fail({ error: cerError.error, status: 400 });
    if (!Rfc.isValid(cerFile.rfc()))
      return fail({ error: "Rfc invalid", status: 400 });
    // Check for private key
    const {
      success: keyIsValid,
      data: keyFile,
      error: keyError,
    } = this.validatePrivateKey();
    if (!keyIsValid) return fail({ error: keyError.error, status: 400 });

    // Check Credentials
    let certification: Credential;
    try {
      certification = new Credential(cerFile, keyFile);
    } catch (e) {
      console.error(e);
      return fail({
        status: 400,
        error: ERROR_SIGNATURE_MESSAGES["PROCESSING_ERROR"],
      });
    }

    // Check if is Valid
    const validated = certification.certificate();
    const isExpired = !validated.validOn();
    if (isExpired)
      return fail({ status: 403, error: ERROR_SIGNATURE_MESSAGES["EXPIRED"] });
    return success(this.parseResult(certification));
  }
}
