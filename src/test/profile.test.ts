import { test, expect } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ProfileImage } from "@images-service";

const dummyPath = resolve(__dirname, "dummy");
const heic = readFileSync(`${dummyPath}/heic-horizontal.heic`);

test("Fallback to image of initials", async () => {
  const image = new ProfileImage({
    user: {
      id: "algo",
      name: "something",
    },
  });
  const { file, filename } = await image.process();
  writeFileSync(resolve(__dirname, "outputs", filename), file);
  expect(Buffer.isBuffer(file)).toBe(true);
});
test("Use heic", async () => {
  const image = new ProfileImage({
    user: {
      id: "heic",
      name: "",
    },
    image: heic,
  });
  const { file, filename } = await image.process();
  writeFileSync(resolve(__dirname, "outputs", filename), file);
  expect(Buffer.isBuffer(file)).toBe(true);
});

const svg = `<svg viewBox="0 0 256 222" width="256" height="256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#fff" d="m128 0 128 221.705H0z"/></svg>`;
test("Use svg", async () => {
  const image = new ProfileImage({
    user: {
      id: "algo",
      name: "svg",
    },
    image: Buffer.from(svg),
  });
  const { file, filename } = await image.process();
  writeFileSync(resolve(__dirname, "outputs", filename), file);
  expect(Buffer.isBuffer(file)).toBe(true);
});
