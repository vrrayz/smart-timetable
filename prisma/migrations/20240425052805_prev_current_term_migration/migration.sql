-- DropForeignKey
ALTER TABLE `CurrentTerm` DROP FOREIGN KEY `CurrentTerm_userId_fkey`;

-- AlterTable
ALTER TABLE `CurrentTerm` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CurrentTerm` ADD CONSTRAINT `CurrentTerm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
