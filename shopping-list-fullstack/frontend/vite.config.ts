import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const target = env.VITE_API_URL || "http://localhost:4000"; // Backend

  return {
    plugins: [react()],
    server: {
      port: 5173,        // <<< WICHTIG: Frontend-Port
      strictPort: true,  // <<< optional, damit er nicht still auf 4000 wechselt
      proxy: {
        "/items": { target, changeOrigin: true },
        "/health": { target, changeOrigin: true },
      },
    },
  };
});
