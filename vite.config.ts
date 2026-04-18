import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const repoFromCi = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const base = process.env.VITE_BASE_PATH ?? (repoFromCi ? `/${repoFromCi}/` : "/");

  return {
    plugins: [react()],
    base,
  };
});
