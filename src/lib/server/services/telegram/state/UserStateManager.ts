/**
 * User conversation state management
 */
export interface UserState {
	awaitingOrderId: boolean;
	awaitingTTN?: boolean;
	awaitingPromoData?: boolean;
	action?: 'confirm' | 'cancel' | 'ship' | 'deliver' | 'create_promo';
	orderId?: string;
	lastActivity?: number;
}

/**
 * Manages user conversation states for multi-step interactions
 */
export class UserStateManager {
	private states: Map<number, UserState> = new Map();
	private readonly CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
	private cleanupTimer: NodeJS.Timeout;

	constructor() {
		this.startCleanupTimer();
	}

	/**
	 * Get user state
	 */
	getState(chatId: number): UserState | undefined {
		return this.states.get(chatId);
	}

	/**
	 * Set user state
	 */
	setState(chatId: number, state: UserState): void {
		state.lastActivity = Date.now();
		this.states.set(chatId, state);
		console.log(`[UserStateManager] State set for ${chatId}:`, state);
	}

	/**
	 * Update user state (partial update)
	 */
	updateState(chatId: number, updates: Partial<UserState>): void {
		const currentState = this.getState(chatId);
		if (currentState) {
			const newState = { ...currentState, ...updates, lastActivity: Date.now() };
			this.setState(chatId, newState);
		} else {
			this.setState(chatId, { ...updates, lastActivity: Date.now() } as UserState);
		}
	}

	/**
	 * Clear user state
	 */
	clearState(chatId: number): void {
		this.states.delete(chatId);
		console.log(`[UserStateManager] State cleared for ${chatId}`);
	}

	/**
	 * Check if user is waiting for input
	 */
	isAwaitingInput(chatId: number): boolean {
		const state = this.getState(chatId);
		return !!(state?.awaitingOrderId || state?.awaitingTTN || state?.awaitingPromoData);
	}

	/**
	 * Get what user is awaiting
	 */
	getAwaitingType(chatId: number): string | null {
		const state = this.getState(chatId);

		if (state?.awaitingOrderId) return 'order_id';
		if (state?.awaitingTTN) return 'ttn';
		if (state?.awaitingPromoData) return 'promo_data';

		return null;
	}

	/**
	 * Process user input based on current state
	 */
	processInput(
		chatId: number,
		input: string
	): {
		action: string | null;
		orderId?: string;
		processed: boolean;
	} {
		const state = this.getState(chatId);

		if (!state) {
			return { action: null, processed: false };
		}

		// Handle order ID input
		if (state.awaitingOrderId && state.action) {
			this.clearState(chatId);
			return {
				action: state.action,
				orderId: input.trim(),
				processed: true
			};
		}

		// Handle TTN input
		if (state.awaitingTTN && state.orderId) {
			this.clearState(chatId);
			return {
				action: 'process_ttn',
				orderId: state.orderId,
				processed: true,
				ttn: input.trim()
			};
		}

		// Handle promo data input
		if (state.awaitingPromoData && state.action === 'create_promo') {
			this.clearState(chatId);
			return {
				action: 'create_promo',
				processed: true,
				promoData: input.trim()
			};
		}

		return { action: null, processed: false };
	}

	/**
	 * Start automatic cleanup of old states
	 */
	private startCleanupTimer(): void {
		this.cleanupTimer = setInterval(() => {
			this.cleanupOldStates();
		}, this.CLEANUP_INTERVAL);
	}

	/**
	 * Clean up old user states
	 */
	private cleanupOldStates(): void {
		const now = Date.now();
		const toDelete: number[] = [];

		for (const [chatId, state] of this.states.entries()) {
			if (state.lastActivity && now - state.lastActivity > this.CLEANUP_INTERVAL) {
				toDelete.push(chatId);
			}
		}

		toDelete.forEach((chatId) => {
			this.clearState(chatId);
		});

		if (toDelete.length > 0) {
			console.log(`[UserStateManager] Cleaned up ${toDelete.length} old states`);
		}
	}

	/**
	 * Get statistics
	 */
	getStats(): {
		totalStates: number;
		activeStates: number;
		awaitingOrderId: number;
		awaitingTTN: number;
		awaitingPromoData: number;
	} {
		const allStates = Array.from(this.states.values());

		return {
			totalStates: this.states.size,
			activeStates: allStates.length,
			awaitingOrderId: allStates.filter((s) => s.awaitingOrderId).length,
			awaitingTTN: allStates.filter((s) => s.awaitingTTN).length,
			awaitingPromoData: allStates.filter((s) => s.awaitingPromoData).length
		};
	}

	/**
	 * Destroy manager (cleanup)
	 */
	destroy(): void {
		if (this.cleanupTimer) {
			clearInterval(this.cleanupTimer);
		}
		this.states.clear();
	}
}
