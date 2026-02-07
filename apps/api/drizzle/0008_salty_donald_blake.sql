CREATE TABLE `workout_plan` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workout_plan_userId_idx` ON `workout_plan` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `workout_plan_name_userId_uidx` ON `workout_plan` (`name`,`user_id`);--> statement-breakpoint
CREATE TABLE `workout_plan_exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`order` integer NOT NULL,
	`planned_sets` integer DEFAULT 3 NOT NULL,
	`planned_reps` integer DEFAULT 10 NOT NULL,
	`planned_weight` real DEFAULT 0 NOT NULL,
	`planned_rest_seconds` integer DEFAULT 90 NOT NULL,
	`workout_plan_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `wpe_workoutPlanId_idx` ON `workout_plan_exercise` (`workout_plan_id`);--> statement-breakpoint
CREATE INDEX `wpe_userId_idx` ON `workout_plan_exercise` (`user_id`);--> statement-breakpoint
ALTER TABLE `planned_slot` ADD `workout_plan_id` text REFERENCES workout_plan(id);