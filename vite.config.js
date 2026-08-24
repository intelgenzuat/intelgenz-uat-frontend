import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "discernible-nonelaborative-joelle.ngrok-free.dev"
    ]
  },
  build: {
    outDir: 'build',  // ← matches Azure's expected output folder
  }
})
