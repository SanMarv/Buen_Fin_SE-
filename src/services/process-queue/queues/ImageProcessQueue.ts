import type { TaskImageProcessing } from "../types.ts";
import { getWorkerPath } from "../workers/utils.ts";
import { Queue } from "./QueueBase.ts";
import { Worker } from "node:worker_threads";

const worker_path = getWorkerPath("../workers/imageProcesing.worker.js");
class ImageProcessQueue extends Queue<TaskImageProcessing> {
  constructor() {
    super({
      size: 10,
      createWorker: () => new Worker(worker_path),
    });
  }
}
export const imageProcessQueue = new ImageProcessQueue();
