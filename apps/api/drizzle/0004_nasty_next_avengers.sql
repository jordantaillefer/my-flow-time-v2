CREATE TABLE `planned_day` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`template_id` text,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `day_template`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `planned_day_userId_idx` ON `planned_day` (`user_id`);--> statement-breakpoint
CREATE INDEX `planned_day_date_idx` ON `planned_day` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `planned_day_date_userId_uidx` ON `planned_day` (`date`,`user_id`);--> statement-breakpoint
CREATE TABLE `planned_slot` (
	`id` text PRIMARY KEY NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`order` integer NOT NULL,
	`subcategory_id` text NOT NULL,
	`planned_day_id` text NOT NULL,
	`template_slot_id` text,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`planned_day_id`) REFERENCES `planned_day`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`template_slot_id`) REFERENCES `template_slot`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `planned_slot_plannedDayId_idx` ON `planned_slot` (`planned_day_id`);--> statement-breakpoint
CREATE INDEX `planned_slot_userId_idx` ON `planned_slot` (`user_id`);--> statement-breakpoint
CREATE INDEX `planned_slot_subcategoryId_idx` ON `planned_slot` (`subcategory_id`);