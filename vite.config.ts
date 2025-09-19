import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build', // output folder
  },
  server: {
    port: 3000,
    open: true,
  },
  root: '.',                // look for index.html at root
  base: '/EZ-Grades/',      // repo name as base path
});
