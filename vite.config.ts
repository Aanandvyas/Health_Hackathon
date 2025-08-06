import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// This is the correct way to get the directory name in an ES module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/Health-Menta',
  build: {
    rollupOptions: {
      output: {
        // This splits larger libraries into their own chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor_framer-motion';
            }
            if (id.includes('leaflet')) {
              return 'vendor_leaflet';
            }
            if (id.includes('react-datepicker')) {
              return 'vendor_react-datepicker';
            }
            if (id.includes('react-dom')) {
                return 'vendor_react-dom';
            }
            // All other libraries from node_modules will be grouped into a single vendor file
            return 'vendor';
          }
        },
      },
    },
  },
});
