import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  runtimeConfig: {
    replicateApiToken: '',
    public: {
      uploadApiKey: 'free'
    }
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
          styles: { configFile: './assets/vuetify.scss' }
        })
      )
    }
  }
})
