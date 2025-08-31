export type SupportedLocale = 'en' | 'uk-ua';

export interface LocaleConfig {
	code: SupportedLocale;
	name: string;
	nativeName: string;
	direction: 'ltr' | 'rtl';
	flag: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
	en: {
		code: 'en',
		name: 'English',
		nativeName: 'English',
		direction: 'ltr',
		flag: '🇺🇸'
	},
	'uk-ua': {
		code: 'uk-ua',
		name: 'Ukrainian',
		nativeName: 'Українська',
		direction: 'ltr',
		flag: '🇺🇦'
	}
};

export const DEFAULT_LOCALE: SupportedLocale = 'uk-ua';

// Типы для переводов (будут генерироваться автоматически)
export interface TranslationKeys {
	profile: {
		meta: {
			title: string;
			description: string;
		};
		title: string;
		logout: string;
		userInformation: string;
		email: string;
		name: string;
		fullName: string;
		deliveryAddress: string;
		street: string;
		streetPlaceholder: string;
		city: string;
		cityPlaceholder: string;
		postalCode: string;
		postalCodePlaceholder: string;
		country: string;
		saveAddress: string;
		saving: string;
		addressSaved: string;
		loading: string;
	};
	error: {
		meta: {
			description: string;
		};
		not_found: {
			title: string;
			message: string;
		};
		server_error: {
			title: string;
			message: string;
		};
		default: {
			title: string;
			message: string;
		};
		return_home: string;
	};
	benefits: {
		title: string;
		golden_paste: {
			title: string;
			turmeric: {
				title: string;
				description: string;
			};
			ginger: {
				title: string;
				description: string;
			};
			coconut_oil: {
				title: string;
				description: string;
			};
			cbd_for_dogs: {
				title: string;
				description: string;
			};
		};
		cbd_oil: {
			title: string;
			mct_base: {
				title: string;
				description: string;
			};
			two_flavors: {
				title: string;
				description: string;
			};
			convenient_dropper: {
				title: string;
				description: string;
			};
			fast_action: {
				title: string;
				description: string;
			};
		};
		recommendation: {
			text: string;
			calculator_link: string;
		};
	};
	products: {
		homepage_title: string;
	};
	hero: {
		title: string;
		subtitle: string;
		shop_button: string;
		learn_button: string;
	};
	meta: {
		title: string;
		description: string;
	};
	header: {
		navigation: {
			shop: string;
			about: string;
			contacts: string;
			blog: string;
		};
		accessibility: {
			account: string;
			shopping_cart: string;
		};
	};
	footer: {
		navigation: {
			shop: string;
			about: string;
			contacts: string;
			blog: string;
			privacy: string;
			terms: string;
			shipping: string;
			returns: string;
		};
		newsletter: {
			title: string;
			description: string;
			email_placeholder: string;
			subscribe_button: string;
		};
		company: {
			description: string;
		};
		legal: {
			copyright: string;
			all_rights_reserved: string;
		};
		social: {
			facebook: string;
			instagram: string;
			telegram: string;
			whatsapp: string;
			tiktok: string;
		};
	};
	subheader: {
		delivery_message: string;
	};
	faq: {
		title: string;
		questions: Array<{
			question: string;
			answer: string;
		}>;
	};
	made_in_ukraine: {
		description: string;
	};
	calculator: {
		title: string;
		pet_type: {
			label: string;
			dog: string;
			cat: string;
		};
		weight: {
			label: string;
			placeholder: string;
		};
		condition: {
			label: string;
			mild: string;
			moderate: string;
			severe: string;
		};
		calculate_button: string;
		results: {
			dosage: string;
			recommendation: string;
			consultation_note: string;
		};
	};
}

// Тип для SEO meta данных
export interface PageMeta {
	title: string;
	description: string;
	keywords?: string;
	image?: string;
	canonical?: string;
	noindex?: boolean;
}
