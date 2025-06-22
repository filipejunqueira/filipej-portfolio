import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Crucial for GitHub Pages deployment
  
  // Performance optimizations
  build: {
    // Enable rollup optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for external libraries
          vendor: [
            'react', 
            'react-dom', 
            'react-helmet-async'
          ],
          // Motion chunk for animations
          motion: ['framer-motion'],
          // Forms chunk
          forms: ['@formspree/react'],
          // Icons chunk
          icons: ['lucide-react'],
          // Firebase chunk (if used)
          firebase: ['firebase']
        }
      }
    },
    // Enable source maps for debugging (but smaller ones)
    sourcemap: 'hidden',
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Minimize CSS
    cssMinify: true,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  
  // Development optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'react-helmet-async',
      '@formspree/react',
      'lucide-react'
    ],
    // Exclude Firebase from pre-bundling to allow for optional loading
    exclude: ['firebase']
  },
  
  // Enable esbuild minification for better performance
  esbuild: {
    // Remove console logs in production
    drop: ['console', 'debugger']
  }
});
