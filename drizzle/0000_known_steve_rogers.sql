CREATE TABLE `plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`major_code` text NOT NULL,
	`completed` text NOT NULL,
	`in_progress` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
