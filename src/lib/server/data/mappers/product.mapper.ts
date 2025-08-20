import type {
	Product,
	CreateProductData,
	UpdateProductData
} from '../../domain/interfaces/product.interface';
import type { ProductDTO, CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';

export class ProductMapper {
	// Convert DTO to Domain model
	static toDomain(dto: ProductDTO): Product {
		return {
			id: dto.id,
			name: dto.name,
			description: dto.description,
			size: dto.size,
			flavor: dto.flavor,
			price: dto.price,
			stock: dto.stock,
			categories: dto.categories,
			imageUrls: dto.image_urls,
			createdAt: new Date(dto.created_at * 1000), // Convert from Unix timestamp
			updatedAt: new Date(dto.updated_at * 1000) // Convert from Unix timestamp
		};
	}

	// Convert Domain model to DTO
	static toDTO(domain: Product): ProductDTO {
		return {
			id: domain.id,
			name: domain.name,
			description: domain.description,
			size: domain.size,
			flavor: domain.flavor,
			price: domain.price,
			stock: domain.stock,
			categories: domain.categories,
			image_urls: domain.imageUrls,
			created_at: Math.floor(domain.createdAt.getTime() / 1000), // Convert to Unix timestamp
			updated_at: Math.floor(domain.updatedAt.getTime() / 1000) // Convert to Unix timestamp
		};
	}

	// Convert Domain create data to DTO
	static createToDTO(data: CreateProductData): CreateProductDTO {
		return {
			name: data.name,
			description: data.description,
			size: data.size,
			flavor: data.flavor,
			price: data.price,
			stock: data.stock,
			categories: data.categoryIds ? JSON.stringify(data.categoryIds) : '[]',
			image_urls: data.imageUrls
		};
	}

	// Convert Domain update data to DTO
	static updateToDTO(data: UpdateProductData): UpdateProductDTO {
		const dto: UpdateProductDTO = {};

		if (data.name !== undefined) dto.name = data.name;
		if (data.description !== undefined) dto.description = data.description;
		if (data.size !== undefined) dto.size = data.size;
		if (data.flavor !== undefined) dto.flavor = data.flavor;
		if (data.price !== undefined) dto.price = data.price;
		if (data.stock !== undefined) dto.stock = data.stock;
		if (data.imageUrls !== undefined) dto.image_urls = data.imageUrls;
		if (data.categoryIds !== undefined) dto.categories = JSON.stringify(data.categoryIds);

		return dto;
	}
}
