/*
  Warnings:

  - You are about to drop the column `endTime` on the `TimeTable` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `TimeTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Schedule` ADD COLUMN `timeTableId` INTEGER NULL;

-- AlterTable
ALTER TABLE `TimeTable` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    ADD COLUMN `repeat` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_timeTableId_fkey` FOREIGN KEY (`timeTableId`) REFERENCES `TimeTable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
