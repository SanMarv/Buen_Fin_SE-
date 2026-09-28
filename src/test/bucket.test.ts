import { test, expect } from "vitest";
import path from "node:path";
import fs from "node:fs";
import { Bucket } from "../services/process-queue/bucket.ts";
const dummyPath = path.resolve(__dirname, "dummy");

const img = fs.readFileSync(`${dummyPath}/horizontal.jpg`);

test("To upload file", async () => {
  const { success, data } = await Bucket.putOne({
    body: img,
    format: "jpg",
    id: "test",
  });
  expect(success).toBe(true);
  expect({ path: data?.path }).toEqual({ path: "/test/test.jpg" });
});

test("To delete file", async () => {
  const { success, data } = await Bucket.deleteOne({ key: "/test.jpg" });
  expect(success).toBe(true);
  expect(data?.status).toBe(204);
});
