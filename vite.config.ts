import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base './' → läuft auf GitHub Pages (Unterpfad) ebenso wie lokal
export default defineConfig({
  base: './',
  plugins: [react()],
});
