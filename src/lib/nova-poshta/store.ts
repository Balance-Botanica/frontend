import { writable, derived } from 'svelte/store';

// Define interfaces for type safety
interface NovaPoshtaState {
	warehouses: any[];
	settlements: Record<string, string>;
	defaultCities: Record<string, string>;
	errors: string[];
	isLoading: boolean;
}

interface SettlementAddress {
	Present: string;
	MainDescription: string;
}

// Initial state
const initialState: NovaPoshtaState = {
	warehouses: [],
	settlements: {},
	defaultCities: {
		'м. Київ, Київська обл.': 'Київ',
		'м. Вінниця, Вінницька обл.': 'Вінниця',
		'м. Дніпро, Дніпропетровська обл.': 'Дніпро',
		'м. Житомир, Житомирська обл.': 'Житомир',
		'м. Запоріжжя, Запорізька обл.': 'Запоріжжя',
		'м. Івано-Франківськ, Івано-Франківська обл.': 'Івано-Франківськ',
		'м. Кропивницький, Кіровоградська обл.': 'Кропивницький',
		'м. Луцьк, Волинська обл.': 'Луцьк',
		'м. Львів, Львівська обл.': 'Львів',
		'м. Миколаїв, Миколаївська обл.': 'Миколаїв',
		'м. Одеса, Одеська обл.': 'Одеса',
		'м. Полтава, Полтавська обл.': 'Полтава',
		'м. Рівне, Рівненська обл.': 'Рівне',
		'м. Суми, Сумська обл.': 'Суми',
		'м. Тернопіль, Тернопільська обл.': 'Тернопіль',
		'м. Ужгород, Закарпатська обл.': 'Ужгород',
		'м. Харків, Харківська обл.': 'Харків',
		'м. Херсон, Херсонська обл': 'Херсон',
		'м. Хмельницький, Хмельницька обл.': 'Хмельницький',
		'м. Черкаси, Черкаська обл.': 'Черкаси',
		'м. Чернігів, Чернігівська обл.': 'Чернігів',
		'м. Чернівці, Чернівецька обл.': 'Чернівці'
	},
	errors: [],
	isLoading: false
};

// Create the store
function createNovaPoshtaStore() {
	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,

		// Fetch warehouses by city name
		fetchWarehouses: async (cityName: string | null = null) => {
			if (!cityName) {
				return;
			}

			update((state) => ({ ...state, isLoading: true }));

			try {
				const requestBody = {
					modelName: 'Address',
					calledMethod: 'getWarehouses',
					methodProperties: {
						CityName: cityName
					}
				};

				const response = await fetch('/api/nova-poshta/getWarehouses', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(requestBody)
				});

				if (!response.ok) {
					console.error('[NovaPoshta Store] API error:', response.status);
					throw new Error(`API returned status: ${response.status}`);
				}

				const jsonData = await response.json();

				if (!jsonData || !jsonData.data || !Array.isArray(jsonData.data)) {
					console.error('[NovaPoshta Store] Unexpected response format:', jsonData);
					throw new Error('Unexpected response format');
				}

				update((state) => ({
					...state,
					warehouses: jsonData.data,
					isLoading: false
				}));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				update((state) => ({
					...state,
					errors: [...state.errors, errorMessage],
					isLoading: false
				}));
			}
		},

		// Search settlements (cities)
		fetchSettlements: async (cityName: string, limit = 50, page = 1) => {
			if (!cityName) return;

			update((state) => ({ ...state, isLoading: true }));

			try {
				const requestBody = {
					modelName: 'Address',
					calledMethod: 'searchSettlements',
					methodProperties: {
						CityName: cityName,
						Limit: limit.toString(),
						Page: page.toString()
					}
				};

				const response = await fetch('/api/nova-poshta/searchSettlements', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(requestBody)
				});

				if (!response.ok) {
					throw new Error(`API returned status: ${response.status}`);
				}

				const jsonData = await response.json();

				if (jsonData.success === false || (jsonData.errors && jsonData.errors.length > 0)) {
					update((state) => ({
						...state,
						errors: jsonData.errors || ['API responded with errors'],
						settlements: {},
						isLoading: false
					}));
					return;
				}

				if (!jsonData || !jsonData.data || !Array.isArray(jsonData.data)) {
					throw new Error('Unexpected response format');
				}

				if (jsonData.data[0]?.TotalCount > 0) {
					const newSettlements: Record<string, string> = {};

					jsonData.data[0].Addresses.forEach((address: SettlementAddress) => {
						newSettlements[address.Present] = address.MainDescription;
					});

					update((state) => ({
						...state,
						settlements: newSettlements,
						errors: [],
						isLoading: false
					}));
				} else {
					update((state) => ({
						...state,
						settlements: {},
						isLoading: false
					}));
				}
			} catch (error) {
				console.error('Error fetching settlements:', error);
				update((state) => ({
					...state,
					errors: [...state.errors, error instanceof Error ? error.message : String(error)],
					isLoading: false
				}));
			}
		},

		// Clear errors
		clearErrors: () => {
			update((state) => ({ ...state, errors: [] }));
		}
	};
}

// Create and export the store
export const novaPoshtaStore = createNovaPoshtaStore();

// Derived stores for convenience
export const warehouses = derived(novaPoshtaStore, ($store) => $store.warehouses);
export const allSettlements = derived(novaPoshtaStore, ($store) =>
	Object.keys($store.settlements).length > 0 ? $store.settlements : $store.defaultCities
);
export const isLoading = derived(novaPoshtaStore, ($store) => $store.isLoading);
export const errors = derived(novaPoshtaStore, ($store) => $store.errors);
