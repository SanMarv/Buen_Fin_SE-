import type { Task, WorkerResult } from "./types.ts";
import { Worker } from "node:worker_threads";
const worker_script = new URL("./worker.js", import.meta.url);
const WORKER_POOL_SIZE = Number(process.env.WORKER_POOL_SIZE ?? 10) || 10;
class Queue {
  private size: number;
  private tasks: Task[] = [];
  private freeWorkers: Worker[] = [];
  static #instance: Queue;
  public static get instance(): Queue {
    if (this.#instance) return this.#instance;
    this.#instance = new Queue();
    return this.#instance;
  }
  private constructor() {
    this.size = WORKER_POOL_SIZE;
    for (let i = 0; i < this.size; i++) {
      const worker = new Worker(worker_script, { env: { ...process.env } });
      worker.on("message", ({ success, error }: WorkerResult) => {
        console.log(
          `image-worker-${worker.threadId} finish with status ${Number(!success)}`,
        );
        console.timeEnd(`image-worker-${worker.threadId}`);
        if (!success) {
          console.error(error.error);
          this.enqueue(error.task);
        }
        this.handleEnd(worker);
      });
      this.freeWorkers.push(worker);
    }
  }
  enqueue(task: Task) {
    if (this.freeWorkers.length > 0) {
      this.runTask(this.freeWorkers.pop()!, task);
    } else {
      this.tasks.push(task);
    }
  }
  private runTask(worker: Worker, task: Task) {
    console.time(`image-worker-${worker.threadId}`);
    worker.postMessage(task);
  }
  private handleEnd(worker: Worker) {
    if (this.tasks.length > 0) {
      this.runTask(worker, this.tasks.shift()!);
    } else {
      this.freeWorkers.push(worker);
    }
  }
}

export const queue = Queue.instance;
