import { defineConfig, loadEnv } from "vite";

import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const bypassHtml = (req) => {
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return "/index.html";
  }
};

export default defineConfig(({ mode }) => {
  const rootDir = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, rootDir, "");
  const apiTarget = env.VITE_API_BASE.replace(/\/$/, "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/media": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/registration": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/blogs": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/products": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/wishlist": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/frames": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/materials": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/backgrounds": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/sizes": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/product-categories": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/inventory": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/artwork-categories": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/artworks": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/artworks-categories-image": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/customized-artworks": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
        "/contact-us": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          bypass: bypassHtml,
        },
      },
    },
  };
});
