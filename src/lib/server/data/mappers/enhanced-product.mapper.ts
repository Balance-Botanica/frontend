// ================================
// 🔄 ENHANCED MAPPERS - Following SOLID Principles
// ================================

import type {
	ProductDatabaseDTO,
	ProductApplicationDTO,
	ProductCardDTO,
	ProductDetailDTO,
	CreateProductCommandDTO,
	UpdateProductCommandDTO
} from '../dtos/enhanced-product.dto';
import type { Product } from '../../domain/entities/product.entity';

// ================================
// 🎯 SINGLE RESPONSIBILITY PRINCIPLE (SRP)
// Each mapper has ONE reason to change
// ================================

/**
 * Database ↔ Application Layer Mapper
 * Responsibility: Convert between database and application representations
 * SRP: Only changes when database schema or application DTO changes
 */
export class ProductDatabaseMapper {
	/**
	 * Convert database DTO to application DTO
	 * Handles data transformation and parsing
	 */
	static toApplication(dbDto: ProductDatabaseDTO): ProductApplicationDTO {
		// Parse JSON fields with error handling
		const categories = this.parseCategories(dbDto.categories);
		const imageUrls = this.parseImageUrls(dbDto.image_urls);

		// Convert timestamps to dates
		const createdAt = new Date(dbDto.created_at * 1000);
		const updatedAt = new Date(dbDto.updated_at * 1000);

		// Business logic calculations
		const priceUAH = dbDto.price / 100;
		const isAvailable = dbDto.stock > 0;
		const isLowStock = dbDto.stock <= 5 && dbDto.stock > 0;

		return {
			id: dbDto.id,
			name: dbDto.name,
			description: dbDto.description,
			size: dbDto.size,
			flavor: dbDto.flavor,
			priceKopiyky: dbDto.price,
			priceUAH,
			stock: dbDto.stock,
			categories,
			imageUrls,
			createdAt,
			updatedAt,
			isAvailable,
			isLowStock,
			nameEn: dbDto.name_en || undefined,
			descriptionEn: dbDto.description_en || undefined,
			sizeEn: dbDto.size_en || undefined,
			flavorEn: dbDto.flavor_en || undefined
		};
	}

	/**
	 * Convert application DTO to database DTO
	 * Handles data serialization
	 */
	static toDatabase(appDto: ProductApplicationDTO): ProductDatabaseDTO {
		return {
			id: appDto.id,
			name: appDto.name,
			description: appDto.description,
			size: appDto.size,
			flavor: appDto.flavor,
			price: appDto.priceKopiyky,
			stock: appDto.stock,
			categories: JSON.stringify(appDto.categories),
			image_urls: JSON.stringify(appDto.imageUrls),
			created_at: Math.floor(appDto.createdAt.getTime() / 1000),
			updated_at: Math.floor(appDto.updatedAt.getTime() / 1000),
			name_en: appDto.nameEn || null,
			description_en: appDto.descriptionEn || null,
			size_en: appDto.sizeEn || null,
			flavor_en: appDto.flavorEn || null
		};
	}

	// ================================
	// 🔧 PRIVATE HELPER METHODS (SRP)
	// ================================

	private static parseCategories(categoriesJson: string): string[] {
		try {
			const parsed = JSON.parse(categoriesJson);
			return Array.isArray(parsed) ? parsed.filter((c) => typeof c === 'string') : [];
		} catch {
			return [];
		}
	}

	private static parseImageUrls(imageUrlsJson: string): string[] {
		try {
			const parsed = JSON.parse(imageUrlsJson);
			return Array.isArray(parsed)
				? parsed.filter((url) => typeof url === 'string' && url.startsWith('http'))
				: [];
		} catch {
			return [];
		}
	}
}

/**
 * Command → Database Mapper
 * Responsibility: Convert commands to database format for persistence
 * SRP: Only changes when command structure or database schema changes
 */
export class ProductCommandMapper {
	static createCommandToDatabase(
		command: CreateProductCommandDTO
	): Omit<ProductDatabaseDTO, 'id' | 'created_at' | 'updated_at'> {
		const now = Math.floor(Date.now() / 1000);

		return {
			name: command.name,
			description: command.description || null,
			size: command.size,
			flavor: command.flavor,
			price: command.priceKopiyky,
			stock: command.stock,
			categories: JSON.stringify(command.categories),
			image_urls: JSON.stringify(command.imageUrls),
			name_en: command.nameEn || null,
			description_en: command.descriptionEn || null,
			size_en: command.sizeEn || null,
			flavor_en: command.flavorEn || null
		};
	}

	static updateCommandToDatabase(command: UpdateProductCommandDTO): Partial<ProductDatabaseDTO> {
		const updates: Partial<ProductDatabaseDTO> = {
			updated_at: Math.floor(Date.now() / 1000)
		};

		if (command.name !== undefined) updates.name = command.name;
		if (command.description !== undefined) updates.description = command.description || null;
		if (command.size !== undefined) updates.size = command.size;
		if (command.flavor !== undefined) updates.flavor = command.flavor;
		if (command.priceKopiyky !== undefined) updates.price = command.priceKopiyky;
		if (command.stock !== undefined) updates.stock = command.stock;
		if (command.categories !== undefined) updates.categories = JSON.stringify(command.categories);
		if (command.imageUrls !== undefined) updates.image_urls = JSON.stringify(command.imageUrls);
		if (command.nameEn !== undefined) updates.name_en = command.nameEn || null;
		if (command.descriptionEn !== undefined) updates.description_en = command.descriptionEn || null;
		if (command.sizeEn !== undefined) updates.size_en = command.sizeEn || null;
		if (command.flavorEn !== undefined) updates.flavor_en = command.flavorEn || null;

		return updates;
	}
}

// ================================
// 🎨 OPEN/CLOSED PRINCIPLE (OCP)
// Mappers are open for extension, closed for modification
// ================================

/**
 * Abstract base mapper for UI representations
 * OCP: Can be extended for different UI contexts without modification
 */
abstract class BaseUIMapper {
	protected static formatPrice(priceKopiyky: number): string {
		const priceUAH = priceKopiyky / 100;
		return `${priceUAH.toFixed(2)} ₴`;
	}

	protected static getStockLevel(stock: number): 'high' | 'medium' | 'low' | 'out' {
		if (stock === 0) return 'out';
		if (stock <= 5) return 'low';
		if (stock <= 20) return 'medium';
		return 'high';
	}

	protected static getPrimaryImage(imageUrls: string[]): string {
		return imageUrls[0] || '/images/product-placeholder.jpg';
	}
}

/**
 * Product Card UI Mapper
 * Responsibility: Convert to card representation
 * OCP: Extends base mapper, can be extended for different card types
 */
export class ProductCardMapper extends BaseUIMapper {
	static fromApplication(appDto: ProductApplicationDTO): ProductCardDTO {
		return {
			id: appDto.id,
			name: appDto.name,
			priceFormatted: this.formatPrice(appDto.priceKopiyky),
			primaryImage: this.getPrimaryImage(appDto.imageUrls),
			imageCount: appDto.imageUrls.length,
			categories: appDto.categories,
			isAvailable: appDto.isAvailable,
			isLowStock: appDto.isLowStock,
			stockLevel: this.getStockLevel(appDto.stock)
		};
	}

	// OCP: Easy to extend for specific card types
	static fromApplicationWithRating(
		appDto: ProductApplicationDTO,
		rating?: number,
		reviewCount?: number
	): ProductCardDTO {
		const cardDto = this.fromApplication(appDto);
		return {
			...cardDto,
			averageRating: rating,
			reviewCount: reviewCount
		};
	}
}

/**
 * Product Detail UI Mapper
 * Responsibility: Convert to detail page representation
 * OCP: Extends base mapper for detail-specific needs
 */
export class ProductDetailMapper extends BaseUIMapper {
	static fromApplication(
		appDto: ProductApplicationDTO,
		relatedProducts: ProductCardDTO[] = [],
		reviews: any[] = []
	): ProductDetailDTO {
		const breadcrumbs = this.generateBreadcrumbs(appDto);
		const avgRating = this.calculateAverageRating(reviews);

		return {
			...appDto,
			priceFormatted: this.formatPrice(appDto.priceKopiyky),
			breadcrumbs,
			relatedProducts,
			reviews,
			avgRating,
			totalReviews: reviews.length,
			metaTitle: this.generateMetaTitle(appDto),
			metaDescription: this.generateMetaDescription(appDto),
			structuredData: this.generateStructuredData(appDto)
		};
	}

	private static generateBreadcrumbs(product: ProductApplicationDTO) {
		return [
			{ name: 'Home', path: '/' },
			{ name: 'Products', path: '/products' },
			{ name: product.categories[0] || 'CBD', path: `/products?category=${product.categories[0]}` },
			{ name: product.name, path: `/products/${product.id}` }
		];
	}

	private static calculateAverageRating(reviews: any[]): number {
		if (reviews.length === 0) return 0;
		const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
		return Number((sum / reviews.length).toFixed(1));
	}

	private static generateMetaTitle(product: ProductApplicationDTO): string {
		return `${product.name} - ${product.priceUAH} ₴ | Balance Botanica`;
	}

	private static generateMetaDescription(product: ProductApplicationDTO): string {
		const desc = product.description || `${product.name} - high quality CBD product`;
		return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
	}

	private static generateStructuredData(product: ProductApplicationDTO): Record<string, any> {
		return {
			'@context': 'https://schema.org/',
			'@type': 'Product',
			name: product.name,
			description: product.description,
			sku: product.id,
			image: product.imageUrls,
			offers: {
				'@type': 'Offer',
				price: product.priceUAH,
				priceCurrency: 'UAH',
				availability: product.isAvailable
					? 'https://schema.org/InStock'
					: 'https://schema.org/OutOfStock'
			}
		};
	}
}

// ================================
// 🔄 LISKOV SUBSTITUTION PRINCIPLE (LSP)
// Mapper implementations can be substituted without affecting behavior
// ================================

/**
 * Mapper interface for consistent substitution
 * LSP: All implementations must honor this contract
 */
export interface IProductMapper<TSource, TTarget> {
	map(source: TSource): TTarget;
}

/**
 * Generic mapper implementation
 * LSP: Can be substituted for any specific mapper implementation
 */
export class GenericProductMapper<TSource, TTarget> implements IProductMapper<TSource, TTarget> {
	constructor(private mapperFn: (source: TSource) => TTarget) {}

	map(source: TSource): TTarget {
		return this.mapperFn(source);
	}
}

// ================================
// 🏭 DEPENDENCY INVERSION PRINCIPLE (DIP)
// High-level modules don't depend on low-level modules
// ================================

/**
 * Mapper factory following DIP
 * High-level code depends on this abstraction, not concrete mappers
 */
export interface IMapperFactory {
	createDatabaseMapper(): typeof ProductDatabaseMapper;
	createCommandMapper(): typeof ProductCommandMapper;
	createCardMapper(): typeof ProductCardMapper;
	createDetailMapper(): typeof ProductDetailMapper;
}

/**
 * Concrete mapper factory
 * DIP: Can be replaced with different implementations
 */
export class ProductMapperFactory implements IMapperFactory {
	createDatabaseMapper() {
		return ProductDatabaseMapper;
	}

	createCommandMapper() {
		return ProductCommandMapper;
	}

	createCardMapper() {
		return ProductCardMapper;
	}

	createDetailMapper() {
		return ProductDetailMapper;
	}
}

// ================================
// 🎯 INTERFACE SEGREGATION PRINCIPLE (ISP)
// Clients shouldn't depend on interfaces they don't use
// ================================

/**
 * Segregated interfaces for different mapper concerns
 * ISP: Each interface serves a specific client need
 */
export interface IDatabaseMapper {
	toApplication(dbDto: ProductDatabaseDTO): ProductApplicationDTO;
	toDatabase(appDto: ProductApplicationDTO): ProductDatabaseDTO;
}

export interface ICommandMapper {
	createCommandToDatabase(
		command: CreateProductCommandDTO
	): Omit<ProductDatabaseDTO, 'id' | 'created_at' | 'updated_at'>;
	updateCommandToDatabase(command: UpdateProductCommandDTO): Partial<ProductDatabaseDTO>;
}

export interface IUIMapper<TTarget> {
	fromApplication(appDto: ProductApplicationDTO): TTarget;
}

// ================================
// 🔧 UTILITY MAPPERS (Pure Functions)
// ================================

/**
 * Pure function mappers for simple transformations
 * No side effects, easy to test and reason about
 */
export const ProductMapperUtils = {
	/**
	 * Convert array of application DTOs to card DTOs
	 */
	toCardList: (appDtos: ProductApplicationDTO[]): ProductCardDTO[] => {
		return appDtos.map((dto) => ProductCardMapper.fromApplication(dto));
	},

	/**
	 * Filter and map products by availability
	 */
	toAvailableCards: (appDtos: ProductApplicationDTO[]): ProductCardDTO[] => {
		return appDtos
			.filter((dto) => dto.isAvailable)
			.map((dto) => ProductCardMapper.fromApplication(dto));
	},

	/**
	 * Convert single domain entity to all DTO representations
	 */
	toAllDTOs: (appDto: ProductApplicationDTO) => ({
		card: ProductCardMapper.fromApplication(appDto),
		database: ProductDatabaseMapper.toDatabase(appDto)
	})
} as const;
