import { defineConfig } from "vitest/config";
import { apiDevPlugin } from "./scripts/vite/apiDevPlugin";

export default defineConfig({
  plugins: [apiDevPlugin()],
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"]
  }
});
