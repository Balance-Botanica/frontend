// Interface for bot event handlers
export interface IBotHandler {
	/**
	 * Handle the bot event
	 */
	handle(chatId: number, data: any): Promise<void>;

	/**
	 * Check if this handler can process the given data
	 */
	canHandle(data: any): boolean;

	/**
	 * Priority of this handler (higher = processed first)
	 */
	getPriority(): number;
}
