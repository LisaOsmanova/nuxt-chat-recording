// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/mdc'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  mdc: {
    highlight: {
      theme: 'material-theme-palenight',
      langs: ['html', 'markdown', 'vue', 'typescript', 'javascript']
    }
  },

  runtimeConfig: {
    openAiApiKey: ''
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: ['debug']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
