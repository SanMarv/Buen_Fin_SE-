import type { TaskProfile, SuccessProfileChange } from "../types.ts";
import { Queue } from "./QueueForRequest.ts";
import { Worker } from "node:worker_threads";
import { getWorkerPath } from "../workers/utils.ts";

const worker_path = getWorkerPath("../workers/profileProcessing.worker.js");
class ProfilesQueue extends Queue<TaskProfile, SuccessProfileChange> {
  constructor() {
    super({
      size: 3,
      createWorker: () => new Worker(worker_path),
    });
  }
}
export const profilesQueue = new ProfilesQueue();
