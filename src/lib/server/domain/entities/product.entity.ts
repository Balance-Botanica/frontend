// Domain Entity - Product with business logic
export class Product {
	constructor(
		private readonly _id: string,
		private readonly _name: string,
		private readonly _description: string | undefined,
		private readonly _price: number,
		private readonly _stock: number,
		private readonly _size: string,
		private readonly _flavor: string,
		private readonly _categories: string[],
		private readonly _imageUrls: string[],
		private readonly _createdAt: Date,
		private readonly _updatedAt: Date,
		private readonly _nameEn?: string,
		private readonly _descriptionEn?: string,
		private readonly _sizeEn?: string,
		private readonly _flavorEn?: string,
		private readonly _labelColor?: string
	) {
		this.validate();
	}

	// Business logic validation
	private validate(): void {
		if (!this._name.trim()) {
			throw new Error('Product name cannot be empty');
		}
		if (this._price < 0) {
			throw new Error('Product price cannot be negative');
		}
		if (this._stock < 0) {
			throw new Error('Product stock cannot be negative');
		}
		if (!this._size.trim()) {
			throw new Error('Product size cannot be empty');
		}
		if (!this._flavor.trim()) {
			throw new Error('Product flavor cannot be empty');
		}
		if (this._categories.length === 0) {
			throw new Error('Product must have at least one category');
		}
		if (this._imageUrls.length === 0) {
			throw new Error('Product must have at least one image');
		}
	}

	// Business logic methods
	isAvailable(): boolean {
		return this._stock > 0;
	}

	isLowStock(threshold: number = 5): boolean {
		return this._stock <= threshold;
	}

	getPriceInUAH(): number {
		return this._price / 100; // Convert from kopiyky to UAH
	}

	hasCategory(category: string): boolean {
		return this._categories.includes(category);
	}

	// Getters (immutable access)
	get id(): string { return this._id; }
	get name(): string { return this._name; }
	get description(): string | undefined { return this._description; }
	get price(): number { return this._price; }
	get stock(): number { return this._stock; }
	get size(): string { return this._size; }
	get flavor(): string { return this._flavor; }
	get categories(): string[] { return [...this._categories]; } // Return copy
	get imageUrls(): string[] { return [...this._imageUrls]; } // Return copy
	get createdAt(): Date { return new Date(this._createdAt); }
	get updatedAt(): Date { return new Date(this._updatedAt); }
	get nameEn(): string | undefined { return this._nameEn; }
	get descriptionEn(): string | undefined { return this._descriptionEn; }
	get sizeEn(): string | undefined { return this._sizeEn; }
	get flavorEn(): string | undefined { return this._flavorEn; }
	get labelColor(): string | undefined { return this._labelColor; }

	// Factory method for creating from DTO
	static fromDTO(dto: any): Product {
		return new Product(
			dto.id,
			dto.name,
			dto.description,
			dto.price,
			dto.stock,
			dto.size,
			dto.flavor,
			Array.isArray(dto.categories) ? dto.categories : JSON.parse(dto.categories || '[]'),
			Array.isArray(dto.imageUrls) ? dto.imageUrls : JSON.parse(dto.imageUrls || '[]'),
			new Date(dto.createdAt),
			new Date(dto.updatedAt),
			dto.name_en,
			dto.description_en,
			dto.size_en,
			dto.flavor_en,
			dto.labelColor || dto.label_color
		);
	}

	// Convert to DTO for persistence
	toDTO(): any {
		return {
			id: this._id,
			name: this._name,
			description: this._description,
			price: this._price,
			stock: this._stock,
			size: this._size,
			flavor: this._flavor,
			categories: JSON.stringify(this._categories),
			image_urls: JSON.stringify(this._imageUrls),
			created_at: this._createdAt,
			updated_at: this._updatedAt,
			name_en: this._nameEn,
			description_en: this._descriptionEn,
			size_en: this._sizeEn,
			flavor_en: this._flavorEn,
			label_color: this._labelColor
		};
	}
}
