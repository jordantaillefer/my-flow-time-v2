CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `category_userId_idx` ON `category` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_userId_uidx` ON `category` (`name`,`user_id`);--> statement-breakpoint
CREATE TABLE `subcategory` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`module_type` text,
	`category_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `subcategory_categoryId_idx` ON `subcategory` (`category_id`);--> statement-breakpoint
CREATE INDEX `subcategory_userId_idx` ON `subcategory` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `subcategory_name_categoryId_uidx` ON `subcategory` (`name`,`category_id`);