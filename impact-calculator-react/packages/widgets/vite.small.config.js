import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), svgr()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/embed-small.jsx'),
      name: 'OFTWSmallWidget',
      formats: ["iife"],
      fileName: () => `embed-small.min.js`
    },
    minify: "esbuild",
    cssCodeSplit: false
  }
});
