-- DropIndex
DROP INDEX `Strategy_userId_fkey` ON `Strategy`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('MAX', 'USER') NOT NULL DEFAULT 'USER';

-- Update
UPDATE User
SET role = 'Max'
WHERE username = 'maxmeng';