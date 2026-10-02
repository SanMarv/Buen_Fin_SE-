import { Queue } from "./QueueForRequest.js";
import type { ImageRecordSuccess, TaskImageUpload } from "../types.js";
import { Worker } from "node:worker_threads";
const worker_script = new URL(
  "../workers/imageUploading.worker.js",
  import.meta.url,
);

class ImageRawQueue extends Queue<TaskImageUpload, ImageRecordSuccess> {
  constructor() {
    super({
      size: 10,
      createWorker: () => new Worker(worker_script),
    });
  }
}

export const imageRawQueue = new ImageRawQueue();
