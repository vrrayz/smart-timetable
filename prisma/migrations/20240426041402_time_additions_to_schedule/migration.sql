-- AlterTable
ALTER TABLE `Schedule` ADD COLUMN `endTime` INTEGER NULL DEFAULT 0,
    ADD COLUMN `startTime` INTEGER NULL DEFAULT 0;
