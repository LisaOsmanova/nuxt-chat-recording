export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: ["@nuxt/eslint"],

  nitro: {
    storage: {
      db: {
        driver: "fs",
        base: "./.data",
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: ["debug"],
    },
  },
  $production: {
    nitro: {
      storage: {
        db: {
          driver: "netlify-blobs",
          name: "db",
        },
      },
    },
  },
});
