import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
       '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/trench/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        404: 'index.html',
      },
    },
  }
})
