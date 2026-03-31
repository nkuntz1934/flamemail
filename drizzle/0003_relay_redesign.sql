DROP TABLE IF EXISTS `relay_pairs`;
--> statement-breakpoint
CREATE TABLE `relay_pairs` (
	`id` text PRIMARY KEY NOT NULL,
	`passphrase_hash` text NOT NULL,
	`inbox_id` text NOT NULL,
	`alias_address` text NOT NULL,
	`alias_domain` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`expires_at` integer,
	FOREIGN KEY (`inbox_id`) REFERENCES `inboxes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `relay_pairs_passphrase_hash_unique` ON `relay_pairs` (`passphrase_hash`);
--> statement-breakpoint
CREATE UNIQUE INDEX `relay_pairs_alias_address_unique` ON `relay_pairs` (`alias_address`);
--> statement-breakpoint
CREATE INDEX `idx_relay_pairs_inbox` ON `relay_pairs` (`inbox_id`);
--> statement-breakpoint
CREATE INDEX `idx_relay_pairs_alias` ON `relay_pairs` (`alias_address`);
