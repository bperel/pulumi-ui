export default defineNuxtConfig({
  devtools: { enabled: true },
  
  ssr: true,
  
  nitro: {
    compatibilityDate: '2025-07-28',
    routeRules: {
      '/api/**': { cors: true }
    },
  },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  },
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {    
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  },
  
  app: {
    head: {
      title: 'Pulumi UI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'UI for visualizing self-hosted Pulumi state' }
      ]
    }
  },
}) 