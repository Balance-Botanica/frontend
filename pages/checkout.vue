<template>
  <div>
    <Container class="pt-24 mb-40 text-center">
      <Heading tag="h3" font-style="h3">CHECKOUT PAGE</Heading>
      <Heading class="mb-4" tag="h1" font-style="h1">
        Want to chat about the wicks?
      </Heading>

      <div class="md:flex md:space-x-8">
        <!-- Left Column -->
        <div class="md:w-1/2 mb-8 md:mb-0">
          <div class="flex space-x-4">
            <input
              class="flex-1 p-2 border rounded w-full"
              placeholder="First Name"
            />
            <input
              class="flex-1 p-2 border rounded w-full"
              placeholder="Last Name"
            />
          </div>
          <input class="w-full p-2 mt-4 border rounded" placeholder="Phone" />
          <input class="w-full p-2 mt-4 border rounded" placeholder="Email" />

          <div class="relative" ref="cityInput">
            <div
              class="city-dropdown-outer w-full p-2 mt-4 cursor-pointer"
              @click="showDropdown = !showDropdown"
            >
              {{ selectedCityFullName || "Select a city" }}
            </div>
            <div
              v-if="showDropdown"
              ref="dropdown"
              class="absolute top-full w-full mt-2 bg-white border rounded dropdown overflow-hidden"
            >
              <input
                v-model="searchQuery"
                placeholder="Введіть значення для пошуку"
                class="w-full p-2 border rounded m-2"
                @focus.prevent
                @input="handleInputChange"
              />
              <div
                v-if="
                  novaPoshtaStore.errors.length > 0 ||
                  (searchQuery && novaPoshtaStore.settlements.size === 0)
                "
                class="border border-t-0 rounded-b p-2 text-left"
              >
                Нічого не знайдено
              </div>
              <div
                v-else
                v-for="(shortName, fullName) in novaPoshtaStore.allSettlements"
                :key="fullName"
                @click="selectCity(fullName)"
                class="cursor-pointer p-2 hover:bg-gray-200 text-left"
              >
                {{ fullName }}
              </div>
            </div>
          </div>

          <div class="relative" ref="warehouseInput">
            <div
              class="warehouse-dropdown-outer w-full p-2 mt-4 cursor-pointer"
              @click="showWarehouseDropdown = !showWarehouseDropdown"
            >
              {{ selectedWarehouse || "Select a warehouse" }}
            </div>
            <div
              v-if="showWarehouseDropdown"
              ref="warehouseDropdown"
              class="absolute top-full w-full mt-2 bg-white border rounded dropdown overflow-hidden max-h-[360px]"
            >
              <input
                v-model="warehouseSearchQuery"
                placeholder="Search for a warehouse"
                class="w-full p-2 border rounded m-2"
                @focus.prevent
                @input="handleWarehouseInputChange"
              />
              <div
                v-if="novaPoshtaStore.allWarehouses.length > 0"
                class="border border-t-0 rounded-b p-2 text-left"
              >
                Нічого не знайдено
              </div>
              <div v-else class="overflow-y-scroll max-h-[300px] min-h-[300px]">
                <div
                  v-for="warehouse in novaPoshtaStore.warehouses"
                  :key="warehouse.Description"
                  @click="selectWarehouse(warehouse.Description)"
                  class="cursor-pointer p-2 hover:bg-gray-200 text-left"
                >
                  {{ warehouse.Description }}
                </div>
              </div>
            </div>
          </div>

          <textarea
            class="w-full p-2 mt-4 border rounded"
            placeholder="Additional Information"
          ></textarea>
        </div>

        <!-- Right Column -->
        <div class="md:w-1/2">
          <h4 class="text-xl font-semibold mb-4">Your Checkout</h4>
          <input class="w-full p-2 mt-4 border rounded" placeholder="Product" />
          <input
            class="w-full p-2 mt-4 border rounded"
            placeholder="Quantity"
          />
          <input class="w-full p-2 mt-4 border rounded" placeholder="Price" />
          <input
            class="w-full p-2 mt-4 border rounded"
            placeholder="Delivery Type"
          />
          <input class="w-full p-2 mt-4 border rounded" placeholder="Total" />

          <h4 class="text-xl font-semibold mt-8 mb-4">Payment Method</h4>
          <label class="inline-flex items-center">
            <input
              type="radio"
              class="form-radio"
              name="payment"
              value="online"
            />
            <span class="ml-2">Online Checkout</span>
          </label>
          <label class="inline-flex items-center ml-6">
            <input
              type="radio"
              class="form-radio"
              name="payment"
              value="cash"
            />
            <span class="ml-2">Cash NovaPoshta</span>
          </label>
          <input class="w-full p-2 mt-4 border rounded" placeholder="IBAN" />
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useNovaPoshtaStore } from "~/store/nova-poshta";

const novaPoshtaStore = useNovaPoshtaStore();

const isLoading = ref(false);
const cityInput = ref(null);
const dropdown = ref(null);
const showDropdown = ref(false);
const selectedCity = ref("");
const selectedCityFullName = ref("");
const searchQuery = ref("");
const warehouseInput = ref(null);
const warehouseDropdown = ref(null);
const showWarehouseDropdown = ref(false);
const selectedWarehouse = ref("");
const warehouseSearchQuery = ref("");
let debounceTimer = null;

const fetchCities = async () => {
  console.log("fetchCities in checkout....");
  selectedCity.value = "";
  isLoading.value = true;
  await novaPoshtaStore.fetchSettlements(searchQuery.value);

  isLoading.value = false;
};

const fetchWarehouses = async () => {
  console.log("fetchWarehouses in checkout for: ", selectedCity.value);
  selectedWarehouse.value = "";
  await novaPoshtaStore.fetchWarehouses(selectedCity.value);

  // Here you might want to filter or sort the results if needed
};

const handleInputChange = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchCities, 100);
};

const handleWarehouseInputChange = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchWarehouses, 100);
};

const selectCity = (cityFullName) => {
  console.log("allSettlements: ", novaPoshtaStore.allSettlements);
  selectedCity.value = novaPoshtaStore.allSettlements[cityFullName];
  selectedCityFullName.value = cityFullName;
  showDropdown.value = false;
  console.log(
    "Selected City: ",
    selectedCity.value,
    selectedCityFullName.value
  );
};

const selectWarehouse = (warehouseName) => {
  selectedWarehouse.value = warehouseName;
  showWarehouseDropdown.value = false;
};

const outsideClickListener = (event) => {
  if (
    dropdown.value &&
    !dropdown.value.contains(event.target) &&
    cityInput.value &&
    !cityInput.value.contains(event.target)
  ) {
    showDropdown.value = false;
  }
  if (
    warehouseDropdown.value &&
    !warehouseDropdown.value.contains(event.target) &&
    warehouseInput.value &&
    !warehouseInput.value.contains(event.target)
  ) {
    showWarehouseDropdown.value = false;
  }
};

const outsideWarehouseClickListener = (event) => {
  if (
    warehouseDropdown.value &&
    !warehouseDropdown.value.contains(event.target) &&
    warehouseInput.value &&
    !warehouseInput.value.contains(event.target)
  ) {
    showWarehouseDropdown.value = false;
  }
};

watch(selectedCity, (newValue) => {
  if (newValue) {
    fetchWarehouses();
  }
});

onMounted(() => {
  document.addEventListener("click", outsideClickListener);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", outsideClickListener);
});
</script>

<style>
.dropdown {
  min-width: 100%;
  min-height: 300px;
  background-color: white;
  z-index: 10;
}

input:focus,
textarea:focus {
  outline: none;
  box-shadow: none;
  border-color: inherit;
}

.city-dropdown-outer,
.warehouse-dropdown-outer {
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  border-radius: 0.25rem;
  height: 40px;
  line-height: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset; /* added inset to match the input shadow */
  padding-left: 12px; /* increased padding slightly */
  padding-right: 12px; /* added right padding */
  font-size: 16px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  cursor: pointer; /* added cursor style for better user experience */
  transition: border 0.3s; /* smooth transition effect for hover */
}

.warehouse-list {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #ccc; /* Optional, adds a border around the scrollable area */
}

.city-dropdown-outer:hover,
.warehouse-dropdown-outer:hover {
  border: 1px solid #b1b5bb; /* slightly darker border on hover for better UX */
}
</style>
