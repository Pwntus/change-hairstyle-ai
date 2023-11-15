import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  runtimeConfig: {
    replicateApiToken: process.env.NUXT_REPLICATE_API_TOKEN || ''
  },
  nitro: {
    preset: 'vercel-edge'
  },
  build: {
    transpile: ['vuetify']
  },
  sourcemap: {
    server: false,
    client: false
  },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins?.push(
        vuetify({
          autoImport: true,
          styles: { configFile: './assets/style/vuetify.scss' }
        })
      )
    }
  }
})
