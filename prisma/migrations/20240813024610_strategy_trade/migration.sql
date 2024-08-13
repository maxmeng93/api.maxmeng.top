/*
  Warnings:

  - You are about to alter the column `type` on the `StrategyDetail` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[name]` on the table `Strategy` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Strategy` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `StrategyDetail` MODIFY `type` ENUM('SMALL', 'MIDDLE', 'BIG') NOT NULL;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `password` DROP DEFAULT,
    ALTER COLUMN `email` DROP DEFAULT,
    MODIFY `updateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `StrategyTrade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('BUY', 'SELL') NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `brokerage` DOUBLE NOT NULL,
    `strategyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Strategy_name_key` ON `Strategy`(`name`);

-- AddForeignKey
ALTER TABLE `Strategy` ADD CONSTRAINT `Strategy_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StrategyTrade` ADD CONSTRAINT `StrategyTrade_strategyId_fkey` FOREIGN KEY (`strategyId`) REFERENCES `Strategy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
