import { Queue } from "./QueueForRequest.js";
import type { ImageRecordSuccess, TaskImageUpload } from "../types.js";
import { Worker } from "node:worker_threads";
import { getWorkerPath } from "../workers/utils.ts";

const worker_script = getWorkerPath("../workers/imageUploading.worker.js");
class ImageRawQueue extends Queue<TaskImageUpload, ImageRecordSuccess> {
  constructor() {
    super({
      size: 10,
      createWorker: () => new Worker(worker_script),
    });
  }
}

export const imageRawQueue = new ImageRawQueue();
