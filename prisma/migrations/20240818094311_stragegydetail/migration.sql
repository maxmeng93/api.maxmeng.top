/*
  Warnings:

  - You are about to drop the column `details` on the `Strategy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Strategy` DROP COLUMN `details`;

-- CreateTable
CREATE TABLE `StrategyDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('SMALL', 'MIDDLE', 'BIG') NOT NULL,
    `level` DOUBLE NOT NULL,
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
ALTER TABLE `StrategyDetail` ADD CONSTRAINT `StrategyDetail_strategyId_fkey` FOREIGN KEY (`strategyId`) REFERENCES `Strategy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
