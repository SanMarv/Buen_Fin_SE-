import { defineConfig } from "vitest/config";

process.loadEnvFile();
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
});
