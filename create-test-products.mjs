import Database from 'better-sqlite3';

try {
	const db = new Database('./drizzle.db');

	console.log('=== Creating Test Products with Categories ===');

	// Clear existing products
	db.prepare('DELETE FROM products').run();
	console.log('✅ Cleared existing products');

	// Cloudinary image URLs (including the one user provided)
	const cloudinaryImages = [
		'https://res.cloudinary.com/dtp21hkrc/image/upload/v1755626661/balance-botanica/products/product-1755626659715-hqv5rg1g4.jpg',
		'https://res.cloudinary.com/dtp21hkrc/image/upload/v1755626661/balance-botanica/products/product-1755626659715-hqv5rg1g4.jpg',
		'https://res.cloudinary.com/dtp21hkrc/image/upload/v1755626661/balance-botanica/products/product-1755626659715-hqv5rg1g4.jpg'
	];

	// Test products with categories as JSON arrays
	const testProducts = [
		// Golden Paste Products
		{
			id: crypto.randomUUID(),
			name: 'Золота паста для собак - 15г',
			name_en: 'Golden Paste for Dogs - 15g',
			description:
				"Преміум золота паста з куркумою та CBD для підтримки здоров'я собак. Невелика упаковка для початківців.",
			description_en:
				'Premium golden paste with turmeric and CBD for dog health support. Small package for beginners.',
			price: 1500, // 15.00 UAH
			stock: 25,
			size: '15г',
			size_en: '15g',
			flavor: 'натуральний',
			flavor_en: 'natural',
			label_color: '#4b766e',
			categories: JSON.stringify(['Пасти']),
			image_urls: JSON.stringify(cloudinaryImages)
		},
		{
			id: crypto.randomUUID(),
			name: 'Золота паста для собак - 30г',
			name_en: 'Golden Paste for Dogs - 30g',
			description:
				"Преміум золота паста з куркумою та CBD для підтримки здоров'я собак. Середня упаковка для регулярного використання.",
			description_en:
				'Premium golden paste with turmeric and CBD for dog health support. Medium package for regular use.',
			price: 2800, // 28.00 UAH
			stock: 20,
			size: '30г',
			size_en: '30g',
			flavor: 'натуральний',
			flavor_en: 'natural',
			label_color: '#4b766e',
			categories: JSON.stringify(['Пасти']),
			image_urls: JSON.stringify(cloudinaryImages)
		},
		{
			id: crypto.randomUUID(),
			name: 'Золота паста для собак - 45г',
			name_en: 'Golden Paste for Dogs - 45g',
			description:
				"Преміум золота паста з куркумою та CBD для підтримки здоров'я собак. Велика упаковка для довгострокового використання.",
			description_en:
				'Premium golden paste with turmeric and CBD for dog health support. Large package for long-term use.',
			price: 4000, // 40.00 UAH
			stock: 15,
			size: '45г',
			size_en: '45g',
			flavor: 'натуральний',
			flavor_en: 'natural',
			label_color: '#4b766e',
			categories: JSON.stringify(['Пасти']),
			image_urls: JSON.stringify(cloudinaryImages)
		},
		{
			id: crypto.randomUUID(),
			name: 'Золота паста для собак - 30г (Бекон)',
			name_en: 'Golden Paste for Dogs - 30g (Bacon)',
			description:
				'Преміум золота паста з куркумою та CBD зі смаком бекону. Собаки обожнюють цей смак!',
			description_en:
				'Premium golden paste with turmeric and CBD with bacon flavor. Dogs love this taste!',
			price: 3000, // 30.00 UAH
			stock: 18,
			size: '30г',
			size_en: '30g',
			flavor: 'бекон',
			flavor_en: 'bacon',
			label_color: '#8B4513',
			categories: JSON.stringify(['Пасти', 'Смаколики']), // Может быть и пастой, и лакомством
			image_urls: JSON.stringify(cloudinaryImages)
		},
		{
			id: crypto.randomUUID(),
			name: 'Золота паста для собак - 30г (Риба)',
			name_en: 'Golden Paste for Dogs - 30g (Fish)',
			description:
				'Преміум золота паста з куркумою та CBD зі смаком риби. Ідеально для кішок та собак, які люблять морепродукти.',
			description_en:
				'Premium golden paste with turmeric and CBD with fish flavor. Perfect for cats and dogs who love seafood.',
			price: 3000, // 30.00 UAH
			stock: 18,
			size: '30г',
			size_en: '30g',
			flavor: 'риба',
			flavor_en: 'fish',
			label_color: '#4682B4',
			categories: JSON.stringify(['Пасти', 'Смаколики']), // Может быть и пастой, и лакомством
			image_urls: JSON.stringify(cloudinaryImages)
		},

		// CBD Oil Products
		{
			id: crypto.randomUUID(),
			name: 'CBD олія для собак - 30мл',
			name_en: 'CBD Oil for Dogs - 30ml',
			description:
				'Преміум CBD олія для собак з органічного конопляного екстракту. Допомагає з тривогою та стресом.',
			description_en:
				'Premium CBD oil for dogs from organic hemp extract. Helps with anxiety and stress.',
			price: 2500, // 25.00 UAH
			stock: 22,
			size: '30мл',
			size_en: '30ml',
			flavor: 'натуральний',
			flavor_en: 'natural',
			label_color: '#4b766e',
			categories: JSON.stringify(['Олія']),
			image_urls: JSON.stringify(cloudinaryImages)
		},
		{
			id: crypto.randomUUID(),
			name: 'CBD олія для собак - 60мл',
			name_en: 'CBD Oil for Dogs - 60ml',
			description:
				'Преміум CBD олія для собак з органічного конопляного екстракту. Велика упаковка для довгострокового використання.',
			description_en:
				'Premium CBD oil for dogs from organic hemp extract. Large package for long-term use.',
			price: 4500, // 45.00 UAH
			stock: 18,
			size: '60мл',
			size_en: '60ml',
			flavor: 'натуральний',
			flavor_en: 'natural',
			label_color: '#4b766e',
			categories: JSON.stringify(['Олія']),
			image_urls: JSON.stringify(cloudinaryImages)
		},
		{
			id: crypto.randomUUID(),
			name: 'CBD олія для собак - 30мл (Бекон)',
			name_en: 'CBD Oil for Dogs - 30ml (Bacon)',
			description: 'Преміум CBD олія для собак зі смаком бекону. Собаки обожнюють цей смак!',
			description_en: 'Premium CBD oil for dogs with bacon flavor. Dogs love this taste!',
			price: 2700, // 27.00 UAH
			stock: 20,
			size: '30мл',
			size_en: '30ml',
			flavor: 'бекон',
			flavor_en: 'bacon',
			label_color: '#8B4513',
			categories: JSON.stringify(['Олія', 'Смаколики']), // Может быть и маслом, и лакомством
			image_urls: JSON.stringify(cloudinaryImages)
		},
		{
			id: crypto.randomUUID(),
			name: 'CBD олія для собак - 30мл (Риба)',
			name_en: 'CBD Oil for Dogs - 30ml (Fish)',
			description:
				'Преміум CBD олія для собак зі смаком риби. Ідеально для кішок та собак, які люблять морепродукти.',
			description_en:
				'Premium CBD oil for dogs with fish flavor. Perfect for cats and dogs who love seafood.',
			price: 2700, // 27.00 UAH
			stock: 20,
			size: '30мл',
			size_en: '30ml',
			flavor: 'риба',
			flavor_en: 'fish',
			label_color: '#4682B4',
			categories: JSON.stringify(['Олія', 'Смаколики']), // Может быть и маслом, и лакомством
			image_urls: JSON.stringify(cloudinaryImages)
		}
	];

	// Insert products
	for (const product of testProducts) {
		const stmt = db.prepare(`
      INSERT INTO products (
        id, name, name_en, description, description_en, price, stock, 
        size, size_en, flavor, flavor_en, label_color, categories, image_urls, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		const now = Math.floor(Date.now() / 1000); // Convert to Unix timestamp

		stmt.run(
			product.id,
			product.name,
			product.name_en,
			product.description,
			product.description_en,
			product.price,
			product.stock,
			product.size,
			product.size_en,
			product.flavor,
			product.flavor_en,
			product.label_color,
			product.categories,
			product.image_urls,
			now,
			now
		);

		console.log(
			`✅ Added product: ${product.name} (${product.size}) - ${product.flavor} - Categories: ${product.categories}`
		);
	}

	console.log(`🎉 Successfully created ${testProducts.length} test products!`);

	// Verify products were added
	const allProducts = db.prepare('SELECT * FROM products').all();
	console.log(`📊 Total products in database: ${allProducts.length}`);

	db.close();
} catch (error) {
	console.error('❌ Error creating test products:', error);
}
