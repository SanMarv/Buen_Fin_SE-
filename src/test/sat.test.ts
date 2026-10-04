import fs from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "vitest";
const dummyPath = resolve(__dirname, "dummy", "efirma");

const password = "12345678a";
import { SatValidator } from "@sat/validator.js";
import { SatMockValidatior } from "@sat/mock.js";

test("Test for valid data", () => {
  const cer = fs.readFileSync(dummyPath + "/fisica/certificate.cer");
  const key = fs.readFileSync(dummyPath + "/fisica/keyfile.key");
  const sat_validation = new SatValidator({ cer, key, password });
  const { success } = sat_validation.validate();
  expect(success).toBe(true);
});

test("Test for invalid cer", () => {
  const key = fs.readFileSync(dummyPath + "/fisica/keyfile.key");
  const sat_validation = new SatValidator({
    cer: Buffer.from("Wrong"),
    key,
    password,
  });
  const { success, error } = sat_validation.validate();
  expect(success).toBe(false);
  expect(error).toEqual({ status: 400, error: "Error validating binary data" });
});

test("Moral", () => {
  const cer = fs.readFileSync(dummyPath + "/moral/certificate.cer");
  const key = fs.readFileSync(dummyPath + "/moral/keyfile.key");
  const sat_validation = new SatValidator({ key, cer, password });
  const { success, data } = sat_validation.validate();
  expect(success).toBe(true);
  expect(data?.rfc).toBeOneOf(["NMT6203040M1", "ZLAY030929WC5"]);
  expect(data?.isMoral).toBe(true);
});

test("Coca example, checking for aditinal information", () => {
  const cer = fs.readFileSync(dummyPath + "/coca/certificate.cer");
  const key = fs.readFileSync(dummyPath + "/coca/keyfile.key");
  const sat_validation = new SatValidator({ key, cer, password });
  const { success, data } = sat_validation.validate();
  expect(success).toBe(true);
  expect(data?.name).toBe("Cocardo Coca Cock");
  expect(data?.hash.length).toBe(344);
});

test("Mock Version", () => {
  const sata_validation = new SatMockValidatior();
  const { success, data } = sata_validation.validate();
  expect(success).toBe(true);
  expect(data?.hash).toHaveLength(344);
  expect(data?.signature).toBeDefined();
});
