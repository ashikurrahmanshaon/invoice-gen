import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,xml,txt}'],
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
          },
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
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
