ALTER TABLE `category` ADD `is_default` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `subcategory` ADD `is_default` integer DEFAULT false NOT NULL;