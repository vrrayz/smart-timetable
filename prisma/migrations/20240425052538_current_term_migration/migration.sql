/*
  Warnings:

  - Made the column `userId` on table `CurrentTerm` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `CurrentTerm` DROP FOREIGN KEY `CurrentTerm_userId_fkey`;

-- AlterTable
ALTER TABLE `CurrentTerm` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CurrentTerm` ADD CONSTRAINT `CurrentTerm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
