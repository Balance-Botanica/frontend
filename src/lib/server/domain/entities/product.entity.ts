// ================================
// 🎯 DOMAIN LAYER - Entities & Value Objects
// Following DDD, GRASP & SOLID principles
// ================================

// ================================
// 💎 VALUE OBJECTS
// ================================

/**
 * Product ID Value Object
 * Responsibility: Encapsulate product identification
 * GRASP: Information Expert (knows ID validation rules)
 */
export class ProductId {
	private constructor(private readonly value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('Product ID cannot be empty');
		}
	}

	static create(value: string): ProductId {
		return new ProductId(value);
	}

	getValue(): string {
		return this.value;
	}

	equals(other: ProductId): boolean {
		return this.value === other.value;
	}
}

/**
 * Money Value Object (Price in kopiyky)
 * Responsibility: Encapsulate monetary values with business rules
 * GRASP: Information Expert (knows money validation and conversion)
 */
export class Money {
	private constructor(private readonly kopiyky: number) {
		if (kopiyky < 0) {
			throw new Error('Money amount cannot be negative');
		}
		if (!Number.isInteger(kopiyky)) {
			throw new Error('Money amount must be an integer (kopiyky)');
		}
	}

	static fromKopiyky(kopiyky: number): Money {
		return new Money(kopiyky);
	}

	static fromUAH(uah: number): Money {
		return new Money(Math.round(uah * 100));
	}

	getKopiyky(): number {
		return this.kopiyky;
	}

	getUAH(): number {
		return this.kopiyky / 100;
	}

	getFormattedUAH(): string {
		return `${this.getUAH().toFixed(2)} ₴`;
	}

	add(other: Money): Money {
		return new Money(this.kopiyky + other.kopiyky);
	}

	subtract(other: Money): Money {
		return new Money(this.kopiyky - other.kopiyky);
	}

	multiply(factor: number): Money {
		return new Money(Math.round(this.kopiyky * factor));
	}

	equals(other: Money): boolean {
		return this.kopiyky === other.kopiyky;
	}

	isGreaterThan(other: Money): boolean {
		return this.kopiyky > other.kopiyky;
	}
}

/**
 * Stock Value Object
 * Responsibility: Encapsulate stock management with business rules
 * GRASP: Information Expert (knows stock validation and levels)
 */
export class Stock {
	private constructor(private readonly quantity: number) {
		if (quantity < 0) {
			throw new Error('Stock quantity cannot be negative');
		}
		if (!Number.isInteger(quantity)) {
			throw new Error('Stock quantity must be an integer');
		}
	}

	static create(quantity: number): Stock {
		return new Stock(quantity);
	}

	getQuantity(): number {
		return this.quantity;
	}

	isAvailable(): boolean {
		return this.quantity > 0;
	}

	isLowStock(threshold: number = 5): boolean {
		return this.quantity <= threshold && this.quantity > 0;
	}

	isOutOfStock(): boolean {
		return this.quantity === 0;
	}

	getStockLevel(): 'high' | 'medium' | 'low' | 'out' {
		if (this.quantity === 0) return 'out';
		if (this.quantity <= 5) return 'low';
		if (this.quantity <= 20) return 'medium';
		return 'high';
	}

	decrease(amount: number): Stock {
		return new Stock(this.quantity - amount);
	}

	increase(amount: number): Stock {
		return new Stock(this.quantity + amount);
	}

	equals(other: Stock): boolean {
		return this.quantity === other.quantity;
	}
}

/**
 * Product Name Value Object
 * Responsibility: Encapsulate product naming with validation
 * GRASP: Information Expert (knows name validation rules)
 */
export class ProductName {
	private constructor(
		private readonly value: string,
		private readonly valueEn?: string
	) {
		if (!value || value.trim().length === 0) {
			throw new Error('Product name cannot be empty');
		}
		if (value.length > 255) {
			throw new Error('Product name cannot exceed 255 characters');
		}
	}

	static create(value: string, valueEn?: string): ProductName {
		return new ProductName(value.trim(), valueEn?.trim());
	}

	getValue(locale: 'uk-ua' | 'en' = 'uk-ua'): string {
		return locale === 'en' && this.valueEn ? this.valueEn : this.value;
	}

	getUkrainian(): string {
		return this.value;
	}

	getEnglish(): string | undefined {
		return this.valueEn;
	}

	equals(other: ProductName): boolean {
		return this.value === other.value && this.valueEn === other.valueEn;
	}
}

// ================================
// 🏢 DOMAIN ENTITY
// ================================

/**
 * Product Domain Entity
 * Responsibility: Core business logic and invariants
 * GRASP: Information Expert, High Cohesion
 * SOLID: Single Responsibility (product business logic)
 */
export class Product {
	constructor(
		private readonly _id: ProductId,
		private readonly _name: ProductName,
		private readonly _description: string | undefined,
		private readonly _price: Money,
		private readonly _stock: Stock,
		private readonly _size: string,
		private readonly _flavor: string,
		private readonly _categories: string[],
		private readonly _imageUrls: string[],
		private readonly _createdAt: Date,
		private readonly _updatedAt: Date,
		private readonly _descriptionEn?: string,
		private readonly _sizeEn?: string,
		private readonly _flavorEn?: string,
		private readonly _labelColor?: string
	) {
		this.validateInvariants();
	}

	// ================================
	// 📜 BUSINESS INVARIANTS
	// ================================

	/**
	 * Validate business invariants
	 * GRASP: Information Expert (knows business rules)
	 */
	private validateInvariants(): void {
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

	// ================================
	// 📊 BUSINESS LOGIC METHODS
	// ================================

	/**
	 * Check if product is available for purchase
	 * GRASP: Information Expert (knows availability rules)
	 */
	isAvailable(): boolean {
		return this._stock.isAvailable();
	}

	/**
	 * Check if product has low stock
	 * GRASP: Information Expert (delegates to Stock value object)
	 */
	isLowStock(threshold?: number): boolean {
		return this._stock.isLowStock(threshold);
	}

	/**
	 * Get stock level indicator
	 * GRASP: Information Expert (delegates to Stock value object)
	 */
	getStockLevel(): 'high' | 'medium' | 'low' | 'out' {
		return this._stock.getStockLevel();
	}

	/**
	 * Check if product belongs to a category
	 * GRASP: Information Expert (knows category membership)
	 */
	hasCategory(category: string): boolean {
		return this._categories.includes(category);
	}

	/**
	 * Get formatted price for display
	 * GRASP: Information Expert (delegates to Money value object)
	 */
	getFormattedPrice(): string {
		return this._price.getFormattedUAH();
	}

	/**
	 * Calculate total price for quantity
	 * GRASP: Information Expert (knows pricing calculations)
	 */
	calculateTotalPrice(quantity: number): Money {
		if (quantity <= 0) {
			throw new Error('Quantity must be positive');
		}
		return this._price.multiply(quantity);
	}

	/**
	 * Check if product can fulfill order quantity
	 * GRASP: Information Expert (knows stock constraints)
	 */
	canFulfillOrder(quantity: number): boolean {
		return this._stock.getQuantity() >= quantity;
	}

	/**
	 * Get localized name
	 * GRASP: Information Expert (delegates to ProductName value object)
	 */
	getName(locale: 'uk-ua' | 'en' = 'uk-ua'): string {
		return this._name.getValue(locale);
	}

	// ================================
	// 🔍 GETTERS (Immutable Access)
	// ================================

	get id(): ProductId {
		return this._id;
	}

	get name(): ProductName {
		return this._name;
	}

	get description(): string | undefined {
		return this._description;
	}

	get price(): Money {
		return this._price;
	}

	get stock(): Stock {
		return this._stock;
	}

	get size(): string {
		return this._size;
	}

	get flavor(): string {
		return this._flavor;
	}

	get categories(): string[] {
		return [...this._categories]; // Return defensive copy
	}

	get imageUrls(): string[] {
		return [...this._imageUrls]; // Return defensive copy
	}

	get primaryImage(): string {
		return this._imageUrls[0] || '';
	}

	get createdAt(): Date {
		return new Date(this._createdAt);
	}

	get updatedAt(): Date {
		return new Date(this._updatedAt);
	}

	get descriptionEn(): string | undefined {
		return this._descriptionEn;
	}

	get sizeEn(): string | undefined {
		return this._sizeEn;
	}

	get flavorEn(): string | undefined {
		return this._flavorEn;
	}

	get labelColor(): string | undefined {
		return this._labelColor;
	}

	// ================================
	// 🏭 FACTORY METHODS
	// ================================

	/**
	 * Create Product from DTO
	 * GRASP: Creator (creates Product instances from data)
	 * SOLID: Single Responsibility (creation logic)
	 */
	static fromDTO(dto: any): Product {
		return new Product(
			ProductId.create(dto.id),
			ProductName.create(dto.name, dto.name_en),
			dto.description,
			Money.fromKopiyky(dto.price),
			Stock.create(dto.stock),
			dto.size,
			dto.flavor,
			Array.isArray(dto.categories) ? dto.categories : JSON.parse(dto.categories || '[]'),
			Array.isArray(dto.imageUrls) ? dto.imageUrls : JSON.parse(dto.image_urls || '[]'),
			new Date(dto.created_at || dto.createdAt),
			new Date(dto.updated_at || dto.updatedAt),
			dto.description_en,
			dto.size_en,
			dto.flavor_en,
			dto.labelColor || dto.label_color
		);
	}

	/**
	 * Create Product from Application DTO
	 * GRASP: Creator (creates Product instances from structured data)
	 */
	static fromApplicationDTO(dto: any): Product {
		return new Product(
			ProductId.create(dto.id),
			ProductName.create(dto.name, dto.nameEn),
			dto.description,
			Money.fromKopiyky(dto.priceKopiyky),
			Stock.create(dto.stock),
			dto.size,
			dto.flavor,
			dto.categories,
			dto.imageUrls,
			dto.createdAt,
			dto.updatedAt,
			dto.descriptionEn,
			dto.sizeEn,
			dto.flavorEn
		);
	}

	// ================================
	// 🔄 CONVERSION METHODS
	// ================================

	/**
	 * Convert to Database DTO
	 * GRASP: Information Expert (knows its own data structure)
	 */
	toDTO(): any {
		return {
			id: this._id.getValue(),
			name: this._name.getUkrainian(),
			description: this._description,
			price: this._price.getKopiyky(),
			stock: this._stock.getQuantity(),
			size: this._size,
			flavor: this._flavor,
			categories: JSON.stringify(this._categories),
			image_urls: JSON.stringify(this._imageUrls),
			created_at: this._createdAt.getTime(),
			updated_at: this._updatedAt.getTime(),
			name_en: this._name.getEnglish(),
			description_en: this._descriptionEn,
			size_en: this._sizeEn,
			flavor_en: this._flavorEn,
			label_color: this._labelColor
		};
	}

	/**
	 * Convert to Application DTO
	 * GRASP: Information Expert (knows how to structure for application layer)
	 */
	toApplicationDTO(): any {
		return {
			id: this._id.getValue(),
			name: this._name.getUkrainian(),
			description: this._description,
			size: this._size,
			flavor: this._flavor,
			priceKopiyky: this._price.getKopiyky(),
			priceUAH: this._price.getUAH(),
			stock: this._stock.getQuantity(),
			categories: [...this._categories],
			imageUrls: [...this._imageUrls],
			createdAt: new Date(this._createdAt),
			updatedAt: new Date(this._updatedAt),
			isAvailable: this.isAvailable(),
			isLowStock: this.isLowStock(),
			nameEn: this._name.getEnglish(),
			descriptionEn: this._descriptionEn,
			sizeEn: this._sizeEn,
			flavorEn: this._flavorEn
		};
	}

	/**
	 * Convert to Card DTO for UI
	 * GRASP: Information Expert (knows how to structure for presentation)
	 */
	toCardDTO(): any {
		return {
			id: this._id.getValue(),
			name: this._name.getUkrainian(),
			priceFormatted: this._price.getFormattedUAH(),
			primaryImage: this.primaryImage,
			imageCount: this._imageUrls.length,
			categories: [...this._categories],
			isAvailable: this.isAvailable(),
			isLowStock: this.isLowStock(),
			stockLevel: this.getStockLevel()
		};
	}
}
