import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ép dùng bản WASM không phụ thuộc Windows 7
    }
  }
})