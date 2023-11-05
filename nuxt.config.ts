// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  plugins: ["~/plugins/firebase.client.js"],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@pinia/nuxt"],
  i18n: {
    lazy: true,
    langDir: "locales",
    strategy: "no_prefix",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        name: "English(US)",
        file: "en-US.json",
      },
      {
        code: "uk-UA",
        iso: "uk-UA",
        name: "Українська",
        file: "uk-UA.json",
      },
    ],
    defaultLocale: "uk-UA",
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
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
      // apiBase: process.env.strapiApiUrl,
      strapiApiUrl: process.env.STRAPI_API_URL,
      npApiUrl: process.env.NP_API_URL,
      npApiKey: process.env.NP_API_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
});
