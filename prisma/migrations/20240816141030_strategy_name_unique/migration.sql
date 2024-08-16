-- DropIndex
DROP INDEX `Strategy_name_key` ON `Strategy`;

-- AlterTable
ALTER TABLE `Strategy` MODIFY `etfCode` VARCHAR(191) NULL;
