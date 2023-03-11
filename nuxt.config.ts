// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "vercel"
  },
  typescript: { shim: false },
  modules: ["@nuxtjs/tailwindcss", "@huntersofbook/naive-ui-nuxt"],
});
