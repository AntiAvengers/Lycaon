import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"

// Vite config
export default defineConfig({
  base: "./",
  plugins: [react(),tailwindcss()],
  server: {
    port: 8080,
    open: true,
  },
});
