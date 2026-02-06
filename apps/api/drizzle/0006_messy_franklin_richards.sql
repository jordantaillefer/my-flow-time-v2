PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image_url` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_exercise`("id", "name", "muscle_group", "description", "image_url", "created_at") SELECT "id", "name", "muscle_group", "description", "image_url", "created_at" FROM `exercise`;--> statement-breakpoint
DROP TABLE `exercise`;--> statement-breakpoint
ALTER TABLE `__new_exercise` RENAME TO `exercise`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_name_unique` ON `exercise` (`name`);--> statement-breakpoint
CREATE INDEX `exercise_muscleGroup_idx` ON `exercise` (`muscle_group`);