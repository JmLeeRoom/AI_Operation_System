import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          // React와 ReactDOM을 하나의 청크로 명시적으로 지정
          'react-vendor': ['react', 'react-dom'],
          // ReactFlow를 별도 청크로
          'reactflow-vendor': ['reactflow'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  server: {
    port: parseInt(process.env.VITE_PORT || '5173', 10),
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  
  envPrefix: 'VITE_',
})
