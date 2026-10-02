import type { TaskWrapper, WorkerResultForRequest } from "../types.ts";
import { type Worker } from "node:worker_threads";

// const WORKER_POOL_SIZE = Number(process.env.WORKER_POOL_SIZE ?? 10) || 10;

export class Queue<Task, Data> {
  private tasks: TaskWrapper<Task, Data>[] = [];
  private freeWorkers: Worker[] = [];
  private readonly size: number;
  private readonly createWorker: () => Worker;
  private waiting: Map<
    number,
    (result: WorkerResultForRequest<Task, Data>) => void
  > = new Map();
  constructor({
    size,
    createWorker,
  }: {
    size: number;
    createWorker: () => Worker;
  }) {
    this.size = size;
    this.createWorker = createWorker;
    this.init();
  }
  private init() {
    for (let i = 0; i < this.size; i++) {
      const worker = this.createWorker();
      worker.on("message", (result: WorkerResultForRequest<Task, Data>) => {
        console.timeEnd(`image-worker-${worker.threadId}`);
        this.handleEnd({ worker, result });
      });
      this.freeWorkers.push(worker);
    }
  }
  async enqueue(task: Task) {
    const { promise, resolve: resolver } =
      Promise.withResolvers<WorkerResultForRequest<Task, Data>>();
    const wrapper: TaskWrapper<Task, Data> = { task, resolver };
    if (this.freeWorkers.length > 0) {
      this.runTask(this.freeWorkers.pop()!, wrapper);
    } else {
      this.tasks.push(wrapper);
    }
    return promise;
  }
  private runTask(worker: Worker, { resolver, task }: TaskWrapper<Task, Data>) {
    console.log(`image-worker-${worker.threadId} pick task`);
    console.time(`image-worker-${worker.threadId}`);
    this.waiting.set(worker.threadId, resolver);
    worker.postMessage(task);
  }
  private handleEnd({
    worker,
    result,
  }: {
    worker: Worker;
    result: WorkerResultForRequest<Task, Data>;
  }) {
    const resolver = this.waiting.get(worker.threadId);
    resolver?.(result);
    this.waiting.delete(worker.threadId);
    if (this.tasks.length > 0) {
      this.runTask(worker, this.tasks.shift()!);
    } else {
      this.freeWorkers.push(worker);
    }
  }
}
