CREATE TABLE `day_template` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `day_template_userId_idx` ON `day_template` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `day_template_name_userId_uidx` ON `day_template` (`name`,`user_id`);--> statement-breakpoint
CREATE TABLE `template_recurrence` (
	`id` text PRIMARY KEY NOT NULL,
	`day_of_week` integer NOT NULL,
	`template_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `day_template`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `template_recurrence_templateId_idx` ON `template_recurrence` (`template_id`);--> statement-breakpoint
CREATE INDEX `template_recurrence_userId_idx` ON `template_recurrence` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `template_recurrence_day_userId_uidx` ON `template_recurrence` (`day_of_week`,`user_id`);--> statement-breakpoint
CREATE TABLE `template_slot` (
	`id` text PRIMARY KEY NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`order` integer NOT NULL,
	`subcategory_id` text NOT NULL,
	`template_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`template_id`) REFERENCES `day_template`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `template_slot_templateId_idx` ON `template_slot` (`template_id`);--> statement-breakpoint
CREATE INDEX `template_slot_userId_idx` ON `template_slot` (`user_id`);--> statement-breakpoint
CREATE INDEX `template_slot_subcategoryId_idx` ON `template_slot` (`subcategory_id`);