ALTER TABLE `exercise` ADD `equipment` text DEFAULT 'poids_du_corps' NOT NULL;--> statement-breakpoint
CREATE INDEX `exercise_equipment_idx` ON `exercise` (`equipment`);