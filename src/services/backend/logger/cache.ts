import { appendFile } from "node:fs/promises";
import type { Logger } from "./factory/Loggers.ts";

export class Cache {
  private max_size: number;
  private file: string;
  private data: string[] = [];

  constructor(size: number = 50, target_file: string) {
    this.max_size = size;
    this.file = target_file;
  }

  async write(logger: Logger) {
    const log = logger.logMessage();
    this.data.push(log);
    if (this.data.length > this.max_size) {
      await this.writeToFile([...this.data]).catch((er) => console.error(er));
      this.data = [];
    }
  }
  private async writeToFile(info: string[]) {
    for await (const log of info) {
      try {
        await appendFile(this.file, log);
      } catch {
        throw new Error("Error appending to file");
      }
    }
  }
}
