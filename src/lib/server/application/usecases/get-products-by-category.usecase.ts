import type { ProductRepository } from '../../../domain/interfaces/product.interface';
import { Product } from '../../../domain/entities/product.entity';

// Use Case: Get Products by Category
export class GetProductsByCategoryUseCase {
	constructor(private productRepository: ProductRepository) {}

	async execute(category: string): Promise<Product[]> {
		try {
			if (!category.trim()) {
				return [];
			}

			const productDTOs = await this.productRepository.getByCategory(category);
			return productDTOs.map((productDTO) => Product.fromDTO(productDTO));
		} catch (error) {
			console.error('Error in GetProductsByCategoryUseCase:', error);
			throw new Error(`Failed to retrieve products for category: ${category}`);
		}
	}
}
