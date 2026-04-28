import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    // Warn for chunks > 300KB
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        // Vite 8 / Rolldown requires manualChunks as a function
        manualChunks(id) {
          // Core React runtime — cached long-term
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // MUI icons — separate large chunk
          if (id.includes('@mui/icons-material')) {
            return 'vendor-mui-icons';
          }
          // MUI framework — cached long-term
          if (id.includes('@mui/material') || id.includes('@emotion/')) {
            return 'vendor-mui';
          }
          // Charts — only loaded when Diagramme page is visited
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'vendor-charts';
          }
        },
      },
    },
    // Enable minification
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
})
