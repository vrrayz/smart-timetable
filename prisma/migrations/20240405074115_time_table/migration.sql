/*
  Warnings:

  - You are about to alter the column `startTime` on the `StudyPreference` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `endTime` on the `StudyPreference` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `breaksPerDay` on the `StudyPreference` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `StudyPreference` MODIFY `startTime` INTEGER NOT NULL,
    MODIFY `endTime` INTEGER NOT NULL,
    MODIFY `breaksPerDay` INTEGER NOT NULL;
