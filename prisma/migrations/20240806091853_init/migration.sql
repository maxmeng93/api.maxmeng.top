-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `avatar` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pid` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('bookmark', 'folder') NOT NULL DEFAULT 'bookmark',
    `link` VARCHAR(191) NOT NULL DEFAULT '',
    `parentId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Strategy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `etfCode` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StrategyDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` DOUBLE NOT NULL,
    `type` INTEGER NOT NULL,
    `buyPrice` DOUBLE NOT NULL,
    `buyQuantity` INTEGER NOT NULL,
    `buyAmount` DOUBLE NOT NULL,
    `sellPrice` DOUBLE NOT NULL,
    `sellQuantity` INTEGER NOT NULL,
    `sellAmount` DOUBLE NOT NULL,
    `strategyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Bookmark`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StrategyDetail` ADD CONSTRAINT `StrategyDetail_strategyId_fkey` FOREIGN KEY (`strategyId`) REFERENCES `Strategy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
