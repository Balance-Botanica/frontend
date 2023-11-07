import { defineStore } from "pinia";
import { collection, getDocs } from "firebase/firestore";

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
          `${config.public.strapiApiUrl}/api/products?populate=*`
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

        console.log("Products in store:", this.productsEN, this.productsUA);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async fetchFirebaseProducts() {
      const nuxtApp = useNuxtApp();
      const db = nuxtApp.$db;

      function capitalizeAttributes(obj) {
        const capitalizedObj = {};
        Object.keys(obj).forEach((key) => {
          // For each key, except for 'images', capitalize the first letter
          if (key !== "images") {
            capitalizedObj[key.charAt(0).toUpperCase() + key.slice(1)] =
              obj[key];
          }
        });
        // Separately handle the 'images' key if it exists
        if (obj.images && Array.isArray(obj.images)) {
          capitalizedObj.Images = {
            data: obj.images.map((imageUrl) => ({
              attributes: { url: imageUrl }, // Set the URL here
            })),
          };
        }
        return capitalizedObj;
      }

      try {
        // Fetch English products
        const productsENCollectionRef = collection(db, "products-us");
        const enQuerySnapshot = await getDocs(productsENCollectionRef);
        const productsEN = enQuerySnapshot.docs.map((doc) => ({
          id: +doc.id,
          attributes: capitalizeAttributes(doc.data()), // Using the helper function
        }));

        // Fetch Ukrainian products
        const productsUACollectionRef = collection(db, "products-uk");
        const uaQuerySnapshot = await getDocs(productsUACollectionRef);
        const productsUA = uaQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          attributes: capitalizeAttributes(doc.data()), // Using the helper function
        }));

        // Update the state with fetched products
        this.productsEN = productsEN;
        this.productsUA = productsUA;

        console.log(
          "Firebase products in store:",
          this.productsEN,
          this.productsUA
        );
      } catch (error) {
        console.error("Error fetching Firebase products:", error);
      }
    },
  },
});
