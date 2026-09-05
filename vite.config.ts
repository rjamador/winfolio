import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // `compiler: true` runs the React Compiler (Rust/oxc build, via
  // oxc-transform-react)
  plugins: [react({ compiler: true }), tailwindcss()],
  server: {
    // Honor an externally assigned port; default 5173.
    port: Number(process.env.PORT) || 5173,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
});
