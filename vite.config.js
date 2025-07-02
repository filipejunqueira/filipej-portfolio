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
        // Manual chunk splitting for better caching and performance
        manualChunks: (id) => {
          // React core dependencies
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react';
          }
          
          // Animation libraries
          if (id.includes('framer-motion')) {
            return 'animations';
          }
          
          // Utility libraries
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          
          // Form libraries
          if (id.includes('@formspree/react')) {
            return 'forms';
          }
          
          // SEO and meta libraries
          if (id.includes('react-helmet-async') || id.includes('react-intersection-observer')) {
            return 'utils';
          }
          
          // Node modules as vendor chunk (fallback)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
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
    chunkSizeWarningLimit: 500,
    // Reduce bundle size
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true
  },
  
  // Development optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'react-helmet-async',
      '@formspree/react',
      'lucide-react',
      'react-intersection-observer'
    ],
    // Exclude large or problematic dependencies
    exclude: []
  },
  
  // Enable esbuild minification for better performance
  esbuild: {
    // Remove console logs in production
    drop: ['console', 'debugger']
  }
});
