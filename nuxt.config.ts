// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['primevue/resources/themes/aura-light-green/theme.css'],
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
  modules: [
    'nuxt-primevue','nuxt-icon'
],
});
