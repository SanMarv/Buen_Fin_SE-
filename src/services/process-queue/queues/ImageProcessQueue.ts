import type { TaskImageProcessing } from "../types.ts";
import { Queue } from "./QueueBase.ts";
import { Worker } from "node:worker_threads";
const worker_script = new URL(
  "../workers/imageProcesing.worker.js",
  import.meta.url,
);
class ImageProcessQueue extends Queue<TaskImageProcessing> {
  constructor() {
    super({
      size: 10,
      createWorker: () => new Worker(worker_script),
    });
  }
}
export const imageProcessQueue = new ImageProcessQueue();
