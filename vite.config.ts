import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from "path"

const ReactCompilerConfig = {
  target: '19'
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: { plugins: ["babel-plugin-react-compiler", ReactCompilerConfig] }
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
