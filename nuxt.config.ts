// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
  modules: [
    'nuxt-primevue','nuxt-icon'
],
primevue: {
  unstyled: true,
  // importPT: { from: path.resolve(__dirname, './presets/lara/') }      //import and apply preset
}
});
