import { defineConfig } from 'vite';

export default defineConfig({
  base: '/analyzer/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/analyzer.js',
        assetFileNames: 'assets/analyzer.[ext]',
      },
    },
  },
});