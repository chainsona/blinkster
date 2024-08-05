CREATE TABLE `account` (
	`username` text PRIMARY KEY NOT NULL,
	`public_key` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`status` text DEFAULT 'unverified'
);
--> statement-breakpoint
CREATE TABLE `whitelist` (
	`public_key` text NOT NULL,
	`price` integer NOT NULL,
	`signature` text,
	`status` text DEFAULT 'unverified',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` integer,
	`starts_at` integer,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
