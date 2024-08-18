/*
  Warnings:

  - You are about to drop the `StrategyDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `StrategyDetail` DROP FOREIGN KEY `StrategyDetail_strategyId_fkey`;

-- AlterTable
ALTER TABLE `Strategy` ADD COLUMN `details` JSON NOT NULL;

-- DropTable
DROP TABLE `StrategyDetail`;
