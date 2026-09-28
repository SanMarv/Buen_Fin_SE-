import type { ImageObject } from "@images/types.js";
import type { Result } from "@app/types";

export interface Task {
  image: ImageObject["image"];
  source: {
    url: string;
  };
}

export type WorkerResult = Result<null, { error: string; task: Task }>;
