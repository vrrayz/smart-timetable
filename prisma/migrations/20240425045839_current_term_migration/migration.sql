-- CreateTable
CREATE TABLE `CurrentTerm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `termId` INTEGER NULL,

    UNIQUE INDEX `CurrentTerm_userId_key`(`userId`),
    UNIQUE INDEX `CurrentTerm_termId_key`(`termId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CurrentTerm` ADD CONSTRAINT `CurrentTerm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CurrentTerm` ADD CONSTRAINT `CurrentTerm_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
