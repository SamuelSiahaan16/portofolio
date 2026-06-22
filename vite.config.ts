import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "three",
      "@thesvg/react/gcp-home",
      "@thesvg/react/gravatar",
      "@thesvg/react/educative",
      "@thesvg/react/exercism",
      "@thesvg/react/livechat",
    ],
  },
});
