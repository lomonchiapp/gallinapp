import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@gallinapp/types': path.resolve(__dirname, '../../packages/types/index.ts'),
      '@gallinapp/assets': path.resolve(__dirname, '../../packages/assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
