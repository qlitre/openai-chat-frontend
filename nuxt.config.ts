import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  srcDir: 'src/',
  routeRules: {
    '/account/**': { ssr: false },
    '/chat/**': { ssr: false },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:8000/api'
    }
  },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  build: {
    transpile: ['vuetify'],
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(vuetify())
    },
  },
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
    define: {
      'process.env.DEBUG': false,
    },
  },
  css: ['@/assets/scss/main.scss', 'material-design-icons-iconfont/dist/material-design-icons.css', 'highlight.js/styles/panda-syntax-dark.css'],
})
