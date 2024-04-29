/*
  Warnings:

  - You are about to drop the column `courseId` on the `TimeTable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `TimeTable` DROP FOREIGN KEY `TimeTable_courseId_fkey`;

-- AlterTable
ALTER TABLE `TimeTable` DROP COLUMN `courseId`;
