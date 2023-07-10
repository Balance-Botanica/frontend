// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ["@nuxtjs/tailwindcss"],
  css: ["tailwindcss/tailwind.css"],
  postcss: require("./postcss.config.js"),
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      script: [
        // {
        //   src: "https://cdn.snipcart.com/themes/v3.2.1/default/snipcart.js",
        //   async: true,
        // },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com" },
        {
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap",
          rel: "stylesheet",
        },
        { rel: "preconnect", href: "https://app.snipcart.com" },
        { rel: "preconnect", href: "https://cdn.snipcart.com" },
        {
          rel: "stylesheet",
          href: "https://cdn.snipcart.com/themes/v3.2.1/default/snipcart.css",
        },
      ],
      style: [],
      noscript: [
        // <noscript>JavaScript is required</noscript>
        { children: "JavaScript is required" },
      ],
    },
  },
  runtimeConfig: {
    // apiSecret: "", // can be overridden by NUXT_API_SECRET environment variable
    public: {
      apiBase: process.env.API_URL, // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    },
  },
});
