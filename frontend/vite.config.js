import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      "/genres": {
        target: 'https://project-final-044d.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});