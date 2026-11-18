import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function normalizeBase(pathname: string): string {
  if (pathname === "/") {
    return "/";
  }

  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
}

const explicitBase = process.env.VITE_BASE_PATH;
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "metsuwuki.github.io";
const base = explicitBase
  ? normalizeBase(explicitBase)
  : repositoryName.endsWith(".github.io")
    ? "/"
    : `/${repositoryName}/`;

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()]
});
