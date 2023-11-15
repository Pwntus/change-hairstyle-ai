import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  runtimeConfig: {
    replicateApiToken: process.env.NUXT_REPLICATE_API_TOKEN || ''
  },
  nitro: {
    preset: 'vercel-edge'
  },
  sourcemap: {
    server: false,
    client: false
  },
  build: {
    transpile: ['vuetify']
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    }
  },
  app: {
    head: {
      script: [
        {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_GTAG_ID}`
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NUXT_GTAG_ID}');`
        }
      ]
    }
  }
})
