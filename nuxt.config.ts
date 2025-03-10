// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt','@primevue/nuxt-module'],
  primevue:{
    options:{
      theme: 'aura-dark-green',
      ripple: true
    }
  },
  css: [
    '~/assets/css/main.css'
  ]
})