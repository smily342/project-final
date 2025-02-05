import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure the base path is correct
  server: {
    proxy: {
      "/genres": {
        target: 'https://project-final-044d.onrender.com', // Updated backend server
        changeOrigin: true,
        secure: true,
      },
    },
  },
});