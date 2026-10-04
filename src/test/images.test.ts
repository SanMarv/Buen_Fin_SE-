import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ImageProcessorFactory } from "@images-service/index.js";

const dummyPath = resolve(__dirname, "dummy");
const heic = readFileSync(`${dummyPath}/heic-horizontal.heic`);

test("Heic to be change to standar format", async () => {
  const imageObject = await ImageProcessorFactory(heic);
  const { image } = await imageObject.raw();
  expect(image.format).toEqual("png");
});
