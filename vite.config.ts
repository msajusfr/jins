import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/jins-icon-192.png", "icons/jins-icon-512.png"],
      manifest: {
        name: "Jin's",
        short_name: "Jin's",
        start_url: "/",
        display: "standalone",
        theme_color: "#1b140f",
        background_color: "#1b140f",
        icons: [
          {
            src: "/icons/jins-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/jins-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
      },
    }),
  ],
});
