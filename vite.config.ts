import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          chart: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  },
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom', 'chart.js', 'react-chartjs-2']
  }
});
