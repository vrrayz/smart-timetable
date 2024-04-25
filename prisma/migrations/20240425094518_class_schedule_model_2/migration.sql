-- DropForeignKey
ALTER TABLE `Schedule` DROP FOREIGN KEY `Schedule_classId_fkey`;

-- AlterTable
ALTER TABLE `Schedule` MODIFY `classId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
