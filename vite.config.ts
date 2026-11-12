import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Proyecto_3D_Materno/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('lucide-react') || id.includes('zod')) {
              return 'ui-vendor';
            }
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
