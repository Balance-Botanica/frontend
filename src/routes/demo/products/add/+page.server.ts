import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	addProduct: async (event) => {
		const formData = await event.request.formData();

		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const price = parseInt(formData.get('price') as string);
		const stock = parseInt(formData.get('stock') as string);
		const category = formData.get('category') as string;
		const imageUrl = formData.get('imageUrl') as string;

		// Validation
		if (!name || name.trim().length < 2) {
			return fail(400, { message: 'Product name must be at least 2 characters' });
		}
		if (price < 0) {
			return fail(400, { message: 'Price cannot be negative' });
		}
		if (stock < 0) {
			return fail(400, { message: 'Stock cannot be negative' });
		}
		if (!category) {
			return fail(400, { message: 'Category is required' });
		}

		try {
			// Create product service with Drizzle
			const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));

			const newProduct = await productService.createProduct({
				name: name.trim(),
				description: description.trim() || undefined,
				price: price * 100, // Convert dollars to cents
				stock,
				category: category.trim(),
				imageUrl: imageUrl.trim() || undefined
			});

			if (newProduct) {
				return redirect(302, '/demo/products');
			} else {
				return fail(500, { message: 'Failed to create product' });
			}
		} catch (error) {
			console.error('Error creating product:', error);
			return fail(500, { message: 'An error occurred while creating the product' });
		}
	}
};
