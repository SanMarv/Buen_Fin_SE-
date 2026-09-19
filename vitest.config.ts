import {} from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
process.loadEnvFile(".env.local");
export default defineConfig({
  plugins: [tsconfigPaths()],
});
