import type { ValidateSatSchema, ValidationResult } from "./interfaces.ts";
import { success } from "@app/types";
import { generateMockName } from "@app/utils";
import { RfcFaker } from "@nodecfdi/rfc";
import { createSign, generateKeyPairSync } from "node:crypto";
import { constract } from "./contract.ts";

const addMonthFromNow = () => {
  const now = new Date();
  const start = new Date().setMonth(now.getMonth() + 1);
  return new Date(start);
};

export class SatMockValidatior {
  constructor(params: Partial<ValidateSatSchema> = {}) {
    // This is for interop bettweean real version and mock
    const _ = params;
  }
  validate(): ValidationResult {
    const rfc = new RfcFaker().mexicanRfc();
    const name = generateMockName();
    const signature = constract({ rfc, name });
    const signer = createSign("RSA-SHA256").update(
      Buffer.from(signature, "utf-8").toString("latin1"),
      "latin1",
    );
    const { privateKey: keyPem } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    const rawSignatureBuffer = signer.sign({
      key: keyPem,
      passphrase: "password",
    });
    const hash = rawSignatureBuffer.toString("base64");

    return success({
      hash,
      rfc,
      signature,
      valid_until: addMonthFromNow(),
      name,
      isMoral: false,
    });
  }
}
