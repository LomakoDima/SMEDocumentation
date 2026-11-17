import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { docsMdx } from "./mdx.config";

export default defineConfig(({ mode }) => ({
  plugins: [
    docsMdx(),
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    nitro({ preset: mode === "node" ? "node-server" : "vercel" }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  server: { host: "0.0.0.0", port: 8080 },
}));
