-- AlterTable
ALTER TABLE `Article` ADD COLUMN `preview` TEXT NOT NULL;
UPDATE `Article` SET `preview` = '';