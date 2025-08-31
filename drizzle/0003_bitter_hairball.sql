CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`items` text NOT NULL,
	`total` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`delivery_address` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `delivery_addresses` ADD `name` text;--> statement-breakpoint
ALTER TABLE `delivery_addresses` ADD `is_default` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `delivery_addresses` ADD `np_city_name` text;--> statement-breakpoint
ALTER TABLE `delivery_addresses` ADD `np_city_full_name` text;--> statement-breakpoint
ALTER TABLE `delivery_addresses` ADD `np_warehouse` text;--> statement-breakpoint
ALTER TABLE `delivery_addresses` ADD `use_nova_post` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `first_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone_number` text;