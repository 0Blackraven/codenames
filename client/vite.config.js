import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: false, // ✅ Correct way to disable CSS minification
  },
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true, // Ensure correct routing behavior
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
