import { Cache } from "./cache.js";
import type { Data } from "./interfaces/data.interfaces.ts";

class LogManager {
  private cache: Cache = new Cache(50, "./logs.txt");

  addLog(data: Data) {}
}

export const manager = new LogManager();
