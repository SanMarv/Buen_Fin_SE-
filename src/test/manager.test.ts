import { test, expect } from "vitest";
import { manager } from "@backend/logger/manager.js";
import { v4 } from "uuid";

test("DB log acceptance", async () => {
  const success = await manager.addLog({
    type: "DB",
    action: "CREATE",
    id: v4(),
    table: "users",
  });
  expect(success).toBe(true);
});

test("Session log acceptance", async () => {
  const success = await manager.addLog({
    type: "Session",
    action: "LOGIN",
    id: v4(),
  });
  expect(success).toBe(true);
});

test("Request log acceptance", async () => {
  const success = await manager.addLog({
    type: "Request",
    action: "GET",
    status: 200,
    id: v4(),
  });
  expect(success).toBe(true);
});

test("Log rejection", async () => {
  const success = await manager.addLog({
    type: "Session",
    action: "LOGIN",
    id: v4(),
  });
  expect(success).toBe(false);
});
