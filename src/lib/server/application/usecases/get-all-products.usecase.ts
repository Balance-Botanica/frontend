import type { ProductRepository } from '../../../domain/interfaces/product.interface';
import { Product } from '../../../domain/entities/product.entity';

// Use Case: Get All Products
export class GetAllProductsUseCase {
	constructor(private productRepository: ProductRepository) {}

	async execute(): Promise<Product[]> {
		try {
			const productDTOs = await this.productRepository.getAll();
			return productDTOs.map((productDTO) => Product.fromDTO(productDTO));
		} catch (error) {
			console.error('Error in GetAllProductsUseCase:', error);
			throw new Error('Failed to retrieve products');
		}
	}
}
