// ================================
// 🎯 DATA LAYER - Mappers
// Following SOLID principles with Interface Segregation
// ================================

import { Product } from '../../domain/entities/product.entity';
import type {
	ProductDTO,
	ProductApplicationDTO,
	CreateProductDTO,
	UpdateProductDTO,
	ProductCardDTO
} from '../dtos/product.dto';

// ================================
// 🏭 MAPPER IMPLEMENTATIONS
// ================================

/**
 * Database Mapper Implementation
 * Responsibility: Map between database DTOs and domain entities
 * SOLID: Single Responsibility (database mapping only)
 * GRASP: Low Coupling (depends only on necessary interfaces)
 */
export class ProductDatabaseMapper {
	/**
	 * Map from database DTO to domain entity
	 * GRASP: Information Expert (knows mapping rules)
	 */
	mapToEntity(dto: ProductDTO): Product {
		return Product.fromDTO({
			id: dto.id,
			name: dto.name,
			description: dto.description,
			price: dto.price,
			stock: dto.stock,
			size: dto.size,
			flavor: dto.flavor,
			categories: dto.categories,
			image_urls: dto.image_urls,
			created_at: dto.created_at,
			updated_at: dto.updated_at,
			name_en: dto.name_en,
			description_en: dto.description_en,
			size_en: dto.size_en,
			flavor_en: dto.flavor_en
		});
	}

	/**
	 * Map from domain entity to database DTO
	 * GRASP: Information Expert (knows database structure)
	 */
	mapToDTO(entity: Product): ProductDTO {
		return entity.toDTO();
	}

	/**
	 * Map array of DTOs to entities
	 * GRASP: High Cohesion (related mapping operations)
	 */
	mapArrayToEntities(dtos: ProductDTO[]): Product[] {
		return dtos.map(dto => this.mapToEntity(dto));
	}
}

/**
 * Application Mapper Implementation
 * Responsibility: Map between domain entities and application DTOs
 * SOLID: Single Responsibility (application layer mapping)
 */
export class ProductApplicationMapper {
	/**
	 * Map from domain entity to application DTO
	 * GRASP: Information Expert (knows application DTO structure)
	 */
	mapToApplicationDTO(entity: Product): ProductApplicationDTO {
		return entity.toApplicationDTO();
	}

	/**
	 * Map from application DTO to domain entity
	 * GRASP: Information Expert (knows how to construct entities)
	 */
	mapFromApplicationDTO(dto: ProductApplicationDTO): Product {
		return Product.fromApplicationDTO(dto);
	}

	/**
	 * Map array of entities to application DTOs
	 * GRASP: High Cohesion (related mapping operations)
	 */
	mapArrayToApplicationDTOs(entities: Product[]): ProductApplicationDTO[] {
		return entities.map(entity => this.mapToApplicationDTO(entity));
	}
}

/**
 * Command Mapper Implementation
 * Responsibility: Map command DTOs to database DTOs
 * SOLID: Single Responsibility (command mapping only)
 */
export class ProductCommandMapper {
	/**
	 * Map create command to database DTO structure
	 * GRASP: Information Expert (knows creation requirements)
	 */
	mapCreateCommand(dto: CreateProductDTO): Partial<ProductDTO> {
		return {
			name: dto.name,
			description: dto.description || null,
			size: dto.size,
			flavor: dto.flavor,
			price: dto.priceKopiyky,
			stock: dto.stock,
			categories: JSON.stringify(dto.categories),
			image_urls: JSON.stringify(dto.imageUrls),
			created_at: Date.now(),
			updated_at: Date.now(),
			name_en: dto.nameEn || null,
			description_en: dto.descriptionEn || null,
			size_en: dto.sizeEn || null,
			flavor_en: dto.flavorEn || null
		};
	}

	/**
	 * Map update command to database DTO structure
	 * GRASP: Information Expert (knows update requirements)
	 */
	mapUpdateCommand(dto: UpdateProductDTO): Partial<ProductDTO> {
		const updates: Partial<ProductDTO> = {
			updated_at: Date.now()
		};

		if (dto.name !== undefined) updates.name = dto.name;
		if (dto.description !== undefined) updates.description = dto.description || null;
		if (dto.size !== undefined) updates.size = dto.size;
		if (dto.flavor !== undefined) updates.flavor = dto.flavor;
		if (dto.priceKopiyky !== undefined) updates.price = dto.priceKopiyky;
		if (dto.stock !== undefined) updates.stock = dto.stock;
		if (dto.categories !== undefined) updates.categories = JSON.stringify(dto.categories);
		if (dto.imageUrls !== undefined) updates.image_urls = JSON.stringify(dto.imageUrls);
		if (dto.nameEn !== undefined) updates.name_en = dto.nameEn || null;
		if (dto.descriptionEn !== undefined) updates.description_en = dto.descriptionEn || null;
		if (dto.sizeEn !== undefined) updates.size_en = dto.sizeEn || null;
		if (dto.flavorEn !== undefined) updates.flavor_en = dto.flavorEn || null;

		return updates;
	}
}

/**
 * Card Mapper Implementation
 * Responsibility: Map domain entities to card presentation DTOs
 * SOLID: Single Responsibility (UI card mapping)
 */
export class ProductCardMapper {
	/**
	 * Map from domain entity to card DTO
	 * GRASP: Information Expert (knows card DTO structure)
	 */
	mapToCardDTO(entity: Product): ProductCardDTO {
		return entity.toCardDTO();
	}

	/**
	 * Map from application DTO to card DTO (alternative path)
	 * GRASP: Polymorphism (different mapping strategies)
	 */
	static fromApplicationDTO(appDto: ProductApplicationDTO): ProductCardDTO {
		return {
			id: appDto.id,
			name: appDto.name,
			priceFormatted: `${appDto.priceUAH.toFixed(2)} ₴`,
			primaryImage: appDto.imageUrls[0] || '',
			imageCount: appDto.imageUrls.length,
			categories: appDto.categories,
			isAvailable: appDto.isAvailable,
			isLowStock: appDto.isLowStock,
			stockLevel: appDto.stock === 0 ? 'out' : 
					 appDto.stock <= 5 ? 'low' : 
					 appDto.stock <= 20 ? 'medium' : 'high'
		};
	}

	/**
	 * Map array of entities to card DTOs
	 * GRASP: High Cohesion (related mapping operations)
	 */
	mapArrayToCardDTOs(entities: Product[]): ProductCardDTO[] {
		return entities.map(entity => this.mapToCardDTO(entity));
	}
}

// ================================
// 🔧 UTILITY MAPPERS (Pure Functions)
// ================================

/**
 * Pure function mappers for simple transformations
 * GRASP: Pure Fabrication (utility functions)
 * SOLID: Single Responsibility (each function has one purpose)
 */
export const ProductMapperUtils = {
	/**
	 * Convert array of database DTOs to entities
	 */
	toEntitiesFromDatabase: (dtos: ProductDTO[]): Product[] => {
		const mapper = new ProductDatabaseMapper();
		return mapper.mapArrayToEntities(dtos);
	},

	/**
	 * Convert array of entities to application DTOs
	 */
	toApplicationDTOs: (entities: Product[]): ProductApplicationDTO[] => {
		const mapper = new ProductApplicationMapper();
		return mapper.mapArrayToApplicationDTOs(entities);
	},

	/**
	 * Convert array of entities to card DTOs
	 */
	toCardDTOs: (entities: Product[]): ProductCardDTO[] => {
		const mapper = new ProductCardMapper();
		return mapper.mapArrayToCardDTOs(entities);
	},

	/**
	 * Filter and map available products to cards
	 */
	toAvailableCards: (entities: Product[]): ProductCardDTO[] => {
		const mapper = new ProductCardMapper();
		return entities
			.filter(entity => entity.isAvailable())
			.map(entity => mapper.mapToCardDTO(entity));
	}
} as const;
