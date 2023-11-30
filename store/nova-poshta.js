import { defineStore } from "pinia";

export const useNovaPoshtaStore = defineStore({
  id: "novaposhta-store",
  state: () => ({
    warehouses: [],
    settlements: {},
    defaultCities: {
      "м. Київ, Київська обл.": "Київ",
      "м. Вінниця, Вінницька обл.": "Вінниця",
      "м. Дніпро, Дніпропетровська обл.": "Дніпро",
      "м. Житомир, Житомирська обл.": "Житомир",
      "м. Запоріжжя, Запорізька обл.": "Запоріжжя",
      "м. Івано-Франківськ, Івано-Франківська обл.": "Івано-Франківськ",
      "м. Кропивницький, Кіровоградська обл.": "Кропивницький",
      "м. Луцьк, Волинська обл.": "Луцьк",
      "м. Львів, Львівська обл.": "Львів",
      "м. Миколаїв, Миколаївська обл.": "Миколаїв",
      "м. Одеса, Одеська обл.": "Одеса",
      "м. Полтава, Полтавська обл.": "Полтава",
      "м. Рівне, Рівненська обл.": "Рівне",
      "м. Суми, Сумська обл.": "Суми",
      "м. Тернопіль, Тернопільська обл.": "Тернопіль",
      "м. Ужгород, Закарпатська обл.": "Ужгород",
      "м. Харків, Харківська обл.": "Харків",
      "м. Херсон, Херсонська обл": "Херсон",
      "м. Хмельницький, Хмельницька обл.": "Хмельницький",
      "м. Черкаси, Черкаська обл.": "Черкаси",
      "м. Чернігів, Чернігівська обл.": "Чернігів",
      "м. Чернівці, Чернівецька обл.": "Чернівці",
    },
    errors: [],
    isLoading: false,
  }),
  getters: {
    allWarehouses: (state) => state.warehouses,
    allSettlements: (state) =>
      Object.keys(state.settlements).length > 0
        ? state.settlements
        : state.defaultCities,

    getErrors: (state) => state.errors,
  },
  actions: {
    async fetchWarehouses(cityName = null) {
      const config = useRuntimeConfig();
      const API_URL = config.public.npApiUrl + "/getWarehouses";
      const API_KEY = config.public.npApiKey;

      const methodProperties = {};
      if (cityName) {
        methodProperties.CityName = cityName;
      }

      const requestBody = {
        apiKey: API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: methodProperties,
      };

      this.isLoading = true;
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (!jsonData || !jsonData.data || !Array.isArray(jsonData.data)) {
          throw new Error("Unexpected response format");
        }

        this.warehouses = jsonData.data;

        console.log("novaPoshta.allWarehouses:", this.allWarehouses);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
      this.isLoading = false;
    },
    async fetchSettlements(cityName, limit = 50, page = 1) {
      const config = useRuntimeConfig();
      const API_URL = config.public.npApiUrl + "/searchSettlements";
      const API_KEY = config.public.npApiKey;

      console.log("Searching for the cityName:", cityName);

      const requestBody = {
        apiKey: API_KEY,
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: {
          CityName: cityName,
          Limit: limit.toString(),
          Page: page.toString(),
        },
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const jsonData = await response.json();

        console.log("fetchSettlements() jsonData:", jsonData);

        if (jsonData.success === false || jsonData.errors.length > 0) {
          this.errors = jsonData.errors;
          throw new Error(
            "API responded with errors: " + jsonData.errors.join(", ")
          );
        }

        if (!jsonData || !jsonData.data || !Array.isArray(jsonData.data)) {
          throw new Error("Unexpected response format");
        }

        if (jsonData.data[0].TotalCount > 0) {
          this.errors = [];
          this.settlements = {};

          jsonData.data[0].Addresses.forEach((address) => {
            this.settlements[address.Present] = address.MainDescription;
          });

          console.log("fetchSettlements() settlements:", this.settlements);
        } else {
          console.log(
            "fetchSettlements() settlements goes empty:",
            this.settlements
          );
          this.settlements = {};
        }

        console.log("novaPoshta.allSettlements:", this.allSettlements);
      } catch (error) {
        console.error("Error fetching settlements:", error);
      }
    },
  },
  // persist: {
  //   storage: persistedState.localStorage,
  // },
});
