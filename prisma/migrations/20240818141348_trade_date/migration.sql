-- AlterTable
ALTER TABLE `StrategyTrade` ADD COLUMN `tradeDate` DATETIME(3) NULL,
    MODIFY `brokerage` DOUBLE NOT NULL DEFAULT 0;
