import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: "src/main/index.ts", // Main process entry file
    }),
    electronRenderer(),
  ],
});
