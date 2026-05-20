import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

function normalizeBase(pathname: string): string {
  if (pathname === "/") {
    return "/";
  }

  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
}

const explicitBase = process.env.VITE_BASE_PATH;
const defaultBase = "/clash_clan/";
const base = explicitBase ? normalizeBase(explicitBase) : defaultBase;

export default defineConfig({
  root: __dirname,
  envDir: __dirname,
  base,
  plugins: [react()],
  server: {
    port: 5174
  },
  build: {
    outDir: resolve(__dirname, "../dist/clash_clan"),
    emptyOutDir: true
  }
});
