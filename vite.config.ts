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
      // This line tells Vite that '@' is a shortcut for the 'src' directory.
      '@': path.resolve(__dirname, './src'),
    },
  },
  // This line tells Vite to build the app for the /Health-Menta/ sub-pat
});
