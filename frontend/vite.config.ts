import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "./index.html",
    },
  },
  server: {
    host: "0.0.0.0",
  },
});
