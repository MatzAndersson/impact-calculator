import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/embed.jsx",       // your loader
      name: "OFTWImpactWidget",
      formats: ["iife"],
      fileName: () => "embed.min.js"
    },
    rollupOptions: {
      // bundle React inside; if you want React external, list it here
      external: []
    },
    minify: "esbuild"
  }
});
