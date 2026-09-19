import { test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ImageProcessorFactory } from "@images-service";

const dummyPath = path.resolve(__dirname, "dummy");
console.log(dummyPath);
const heic = fs.readFileSync(`${dummyPath}/heic-horizontal.heic`);

test("Heic to be change to standar format", async () => {
  const imageObject = await ImageProcessorFactory(heic);
  const { image } = await imageObject.raw();
  expect(image.format).toEqual("png");
});
