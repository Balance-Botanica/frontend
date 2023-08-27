import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

export const useProductsStore = defineStore({
  id: "products-store",
  state: () => ({
    productsEN: [],
    productsUA: [],
    currentProduct: null,
  }),
  getters: {
    allProducts: (state) => state.products,
    // currentProduct: (state) => state.product,
  },
  actions: {
    selectProduct(product) {
      this.currentProduct = product; // Store the entire product, not just the ID
    },
    async fetchProducts() {
      const config = useRuntimeConfig();

      try {
        const response = await fetch(
          `${config.public.API_URL}/api/products?populate=*`
        );

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (!jsonData || !jsonData.data || !Array.isArray(jsonData.data)) {
          throw new Error("Unexpected response format");
        }

        const productsEN = [];
        const productsUA = [];

        jsonData.data.forEach((product) => {
          if (product.attributes && product.attributes.locale === "uk-UA") {
            productsUA.push(product);

            if (
              product.attributes.localizations &&
              product.attributes.localizations.data
            ) {
              const enLocalization = product.attributes.localizations.data.find(
                (loc) => loc.attributes && loc.attributes.locale === "en"
              );
              if (enLocalization) {
                // Create a similar structure for the EN product
                const enProduct = {
                  id: product.id, // Maintain the original product ID
                  attributes: {
                    ...product.attributes, // Copy all attributes from the UA product
                    ...enLocalization.attributes, // Override with EN-specific attributes
                  },
                };
                // Ensure the 'Images' attribute from the UA product is also present in the EN product
                if (product.attributes.Images) {
                  enProduct.attributes.Images = product.attributes.Images;
                }
                productsEN.push(enProduct);
              }
            }
          }
        });

        this.productsEN = productsEN;
        this.productsUA = productsUA;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
});
