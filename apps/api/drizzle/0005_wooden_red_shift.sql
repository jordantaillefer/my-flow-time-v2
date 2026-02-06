CREATE TABLE `exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image_url` text,
	`is_default` integer DEFAULT false NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `exercise_userId_idx` ON `exercise` (`user_id`);--> statement-breakpoint
CREATE INDEX `exercise_muscleGroup_idx` ON `exercise` (`muscle_group`);--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_name_userId_uidx` ON `exercise` (`name`,`user_id`);