CREATE TABLE `canvases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`viewportX` float NOT NULL DEFAULT 0,
	`viewportY` float NOT NULL DEFAULT 0,
	`zoom` float NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `canvases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cardGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`canvasId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`color` varchar(32) NOT NULL,
	`x` float NOT NULL DEFAULT 0,
	`y` float NOT NULL DEFAULT 0,
	`width` float NOT NULL DEFAULT 540,
	`height` float NOT NULL DEFAULT 360,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cardGroups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cardLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`canvasId` int NOT NULL,
	`fromCardId` int NOT NULL,
	`toCardId` int NOT NULL,
	`label` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cardLinks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`canvasId` int NOT NULL,
	`groupId` int,
	`sourceId` int,
	`title` varchar(240) NOT NULL,
	`body` text NOT NULL,
	`cardType` enum('note','quote','question','insight','summary') NOT NULL DEFAULT 'note',
	`accent` varchar(32) NOT NULL DEFAULT 'mint',
	`x` float NOT NULL DEFAULT 0,
	`y` float NOT NULL DEFAULT 0,
	`width` float NOT NULL DEFAULT 260,
	`height` float NOT NULL DEFAULT 180,
	`pinned` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`canvasId` int,
	`title` varchar(240) NOT NULL,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sourceCards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int NOT NULL,
	`cardId` int NOT NULL,
	`passage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sourceCards_id` PRIMARY KEY(`id`),
	CONSTRAINT `source_card_idx` UNIQUE(`sourceId`,`cardId`)
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`sourceType` enum('url','pdf','document','image','audio','artifact','connector') NOT NULL DEFAULT 'url',
	`url` text,
	`storageKey` text,
	`mimeType` varchar(120),
	`excerpt` text,
	`metadata` text,
	`externalId` varchar(240),
	`adapter` varchar(80),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `syncRuns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`adapter` varchar(80) NOT NULL,
	`status` enum('idle','running','completed','failed') NOT NULL DEFAULT 'idle',
	`itemsProcessed` int NOT NULL DEFAULT 0,
	`errorMessage` text,
	`lastCursor` text,
	`startedAt` timestamp,
	`finishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `syncRuns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaceMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','editor','viewer') NOT NULL DEFAULT 'viewer',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workspaceMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `workspace_member_idx` UNIQUE(`workspaceId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`),
	CONSTRAINT `workspace_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `canvas_workspace_idx` ON `canvases` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `group_canvas_idx` ON `cardGroups` (`canvasId`);--> statement-breakpoint
CREATE INDEX `link_canvas_idx` ON `cardLinks` (`canvasId`);--> statement-breakpoint
CREATE INDEX `card_canvas_idx` ON `cards` (`canvasId`);--> statement-breakpoint
CREATE INDEX `card_source_idx` ON `cards` (`sourceId`);--> statement-breakpoint
CREATE INDEX `note_workspace_idx` ON `notes` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `source_workspace_idx` ON `sources` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `source_external_idx` ON `sources` (`externalId`);--> statement-breakpoint
CREATE INDEX `sync_workspace_idx` ON `syncRuns` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `workspace_owner_idx` ON `workspaces` (`ownerId`);