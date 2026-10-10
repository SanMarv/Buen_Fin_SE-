export const getWorkerPath = (path: string): URL =>
  new URL(path, import.meta.url);
