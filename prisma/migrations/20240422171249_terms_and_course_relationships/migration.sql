-- AlterTable
ALTER TABLE `Course` ADD COLUMN `termId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
