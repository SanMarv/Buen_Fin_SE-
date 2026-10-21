import { Cache } from "./cache.js";
import { LoggerMaker } from "./factory/LoggerFactory.ts";

import { type DataType, type PayloadType } from "./types.js";

class LogManager {
  private cache: Cache = new Cache(1, "./logs.txt");

  addLog(data: DataType): boolean {
    try {
      const payload: PayloadType = {
        start_time: new Date().toString(),
        ...data,
      };
      const logger = LoggerMaker(payload).create();
      this.cache.write(logger);
      return true;
    } catch {
      return false;
    }
  }
}

export const manager = new LogManager();
