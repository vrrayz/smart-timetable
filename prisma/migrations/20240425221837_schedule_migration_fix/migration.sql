-- DropForeignKey
ALTER TABLE `Schedule` DROP FOREIGN KEY `Schedule_termId_fkey`;

-- AlterTable
ALTER TABLE `Schedule` MODIFY `termId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
