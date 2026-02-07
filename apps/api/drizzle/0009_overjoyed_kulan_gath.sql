CREATE TABLE `workout_session` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`started_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`completed_at` integer,
	`workout_plan_id` text NOT NULL,
	`planned_slot_id` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`planned_slot_id`) REFERENCES `planned_slot`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workout_session_userId_idx` ON `workout_session` (`user_id`);--> statement-breakpoint
CREATE INDEX `workout_session_workoutPlanId_idx` ON `workout_session` (`workout_plan_id`);--> statement-breakpoint
CREATE INDEX `workout_session_status_idx` ON `workout_session` (`status`);--> statement-breakpoint
CREATE TABLE `workout_set` (
	`id` text PRIMARY KEY NOT NULL,
	`set_number` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight` real DEFAULT 0 NOT NULL,
	`feeling` integer DEFAULT 3 NOT NULL,
	`completed_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`session_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`workout_plan_exercise_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `workout_session`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workout_plan_exercise_id`) REFERENCES `workout_plan_exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workout_set_sessionId_idx` ON `workout_set` (`session_id`);--> statement-breakpoint
CREATE INDEX `workout_set_exerciseId_idx` ON `workout_set` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `workout_set_userId_idx` ON `workout_set` (`user_id`);