import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

function normalizeBase(pathname) {
  if (pathname === "/") {
    return "/";
  }

  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
}

const explicitBase = process.env.VITE_BASE_PATH;
const defaultBase = "/mine_sweeper/";
const base = explicitBase ? normalizeBase(explicitBase) : defaultBase;

export default defineConfig({
  root: __dirname,
  envDir: resolve(__dirname, ".."),
  base,
  plugins: [react()],
  server: {
    port: 5175
  },
  build: {
    outDir: resolve(__dirname, "../dist/mine_sweeper"),
    emptyOutDir: true
  }
});
