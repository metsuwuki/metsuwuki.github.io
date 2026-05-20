import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

function normalizeBase(pathname: string): string {
  if (pathname === "/") {
    return "/";
  }

  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
}

const explicitBase = process.env.VITE_BASE_PATH;
const defaultBase = "/animesite/";
const base = explicitBase
  ? normalizeBase(explicitBase)
  : defaultBase;

export default defineConfig({
  root: __dirname,
  base,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(__dirname, "../dist/animesite"),
    emptyOutDir: true
  }
});
