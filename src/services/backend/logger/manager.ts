import { Cache } from "./cache.js";
import { LoggerMaker } from "./factory/LoggerFactory.ts";

import { type DataType, type PayloadType } from "./types.js";

class LogManager {
  private cache: Cache = new Cache(50, "./logs.txt");

  async addLog(data: DataType): Promise<boolean> {
    try {
      const payload: PayloadType = {
        start_time: new Date().toString(),
        ...data,
      };
      const logger = LoggerMaker(payload).create();
      await this.cache.write(logger);
      return true;
    } catch {
      return false;
    }
  }
}

export const manager = new LogManager();
