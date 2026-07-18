import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

function cacheControlPlugin() {
  return {
    name: 'cache-control',
    configurePreviewServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.originalUrl || req.url || '';
        if (url.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (/\.(js|css|png|jpe?g|svg|webp|avif|gif|ico|woff2?)$/i.test(url)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    cacheControlPlugin(),
    (viteCompression as any)({ algorithm: 'gzip', ext: '.gz' }),
    (viteCompression as any)({ algorithm: 'brotliCompress', ext: '.br' }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/],
        maximumFileSizeToCacheInBytes: 5000000
      },
      manifest: {
        short_name: "Invoice-Gen",
        name: "Invoice-Gen.net | Free Professional Invoice Creator",
        description: "Create professional PDF invoices instantly. 100% free, secure, browser-based.",
        id: "/",
        scope: "/",
        start_url: ".",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#f9fafb",
        icons: [
          {
            src: "favicon.svg",
            type: "image/svg+xml",
            sizes: "any"
          }
        ]
      }
    }),
    visualizer({ filename: 'bundle-analysis.html', gzipSize: true, open: false })
  ],
  build: {
    cssTarget: 'safari14',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('jspdf') || id.includes('react-pdf') || id.includes('html-to-image')) {
            return 'vendor-pdf';
          }
          if (id.includes('react/') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react';
          }
          if (id.includes('i18next')) {
            return 'vendor-i18n';
          }
          if (id.includes('lucide-react')) {
            return 'vendor-ui';
          }
        },
        assetFileNames: (assetInfo) => {
          let name = assetInfo.name || '';
          if (name.endsWith('.mjs')) {
            return 'assets/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    }
  }
})
