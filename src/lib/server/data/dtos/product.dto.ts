// ================================
// 🎯 DATA LAYER - DTOs (Data Transfer Objects)
// Following GRASP principles: Low Coupling, High Cohesion
// ================================

// ================================
// 📊 DATABASE DTOs (Raw Database Representation)
// ================================

/**
 * Raw database DTO - exactly matches database schema
 * Responsibility: Data transfer between database and application
 * GRASP: Information Expert (knows database structure)
 */
export interface ProductDTO {
	id: string;
	name: string;
	description: string | null;
	size: string;
	flavor: string;
	price: number; // in kopiyky
	stock: number;
	categories: string; // JSON string
	image_urls: string; // JSON string
	created_at: number; // Unix timestamp
	updated_at: number; // Unix timestamp
	
	// i18n fields (future)
	name_en?: string | null;
	description_en?: string | null;
	size_en?: string | null;
	flavor_en?: string | null;
}

// ================================
// 🔄 APPLICATION DTOs (Business Layer Representation)
// ================================

/**
 * Application DTO - structured for business operations
 * Responsibility: Data transfer between layers with business context
 * GRASP: Low Coupling (doesn't depend on database specifics)
 */
export interface ProductApplicationDTO {
	id: string;
	name: string;
	description: string | null;
	size: string;
	flavor: string;
	priceKopiyky: number; // explicit unit
	priceUAH: number; // calculated convenience field
	stock: number;
	categories: string[]; // parsed array
	imageUrls: string[]; // parsed array
	createdAt: Date; // proper Date object
	updatedAt: Date; // proper Date object
	
	// Business computed fields
	isAvailable: boolean;
	isLowStock: boolean;
	
	// i18n fields
	nameEn?: string;
	descriptionEn?: string;
	sizeEn?: string;
	flavorEn?: string;
}

// ================================
// 📝 COMMAND DTOs (for mutations)
// ================================

/**
 * Create Product Command DTO
 * Responsibility: Capture creation intent
 * GRASP: Controller (coordinates creation process)
 */
export interface CreateProductDTO {
	name: string;
	description?: string;
	size: string;
	flavor: string;
	priceKopiyky: number;
	stock: number;
	categories: string[];
	imageUrls: string[];
	
	// i18n fields
	nameEn?: string;
	descriptionEn?: string;
	sizeEn?: string;
	flavorEn?: string;
}

/**
 * Update Product Command DTO
 * Responsibility: Capture update intent
 * GRASP: Polymorphism (different update strategies)
 */
export interface UpdateProductDTO {
	id: string;
	name?: string;
	description?: string;
	size?: string;
	flavor?: string;
	priceKopiyky?: number;
	stock?: number;
	categories?: string[];
	imageUrls?: string[];
	
	// i18n fields
	nameEn?: string;
	descriptionEn?: string;
	sizeEn?: string;
	flavorEn?: string;
}

// ================================
// 🔍 QUERY DTOs (for queries)
// ================================

/**
 * Product Query DTO
 * Responsibility: Encapsulate query parameters
 * GRASP: Pure Fabrication (artificial class for query logic)
 */
export interface ProductQueryDTO {
	// Filtering
	category?: string;
	minPrice?: number; // in kopiyky
	maxPrice?: number; // in kopiyky
	inStock?: boolean;
	searchTerm?: string;
	
	// Pagination
	page?: number;
	limit?: number;
	
	// Sorting
	sortBy?: 'name' | 'price' | 'created_at' | 'stock';
	sortOrder?: 'asc' | 'desc';
	
	// i18n
	locale?: 'uk-ua' | 'en';
}

// ================================
// ⚡ PRESENTATION DTOs (for UI)
// ================================

/**
 * Product Card UI DTO
 * Responsibility: Optimized for product card display
 * GRASP: Low Coupling (UI-specific, doesn't affect business logic)
 */
export interface ProductCardDTO {
	id: string;
	name: string;
	priceFormatted: string; // "25.00 ₴"
	originalPrice?: string; // for sale prices
	primaryImage: string;
	imageCount: number;
	categories: string[];
	isAvailable: boolean;
	isLowStock: boolean;
	stockLevel: 'high' | 'medium' | 'low' | 'out';
	averageRating?: number;
	reviewCount?: number;
}