import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://menu-4p83.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env.VERCEL_ENV': JSON.stringify(process.env.VERCEL_ENV),
  },
})
