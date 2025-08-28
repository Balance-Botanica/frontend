CREATE TABLE `delivery_addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`street` text NOT NULL,
	`city` text NOT NULL,
	`postal_code` text NOT NULL,
	`country` text DEFAULT 'Ukraine' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
