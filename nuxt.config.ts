// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
    server: {
      // 默认localhost 只能本地访问
      // 若想要对外访问，要配置为 0.0.0.0
      host: "0.0.0.0",
      // nuxtjs 默认 3000
      // vercel 默认80
      port: 80,
    },
  },
  typescript: { shim: false },
  modules: ["@nuxtjs/tailwindcss", "@huntersofbook/naive-ui-nuxt"],
});
