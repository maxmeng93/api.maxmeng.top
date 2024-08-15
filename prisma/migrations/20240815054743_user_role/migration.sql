-- DropIndex
DROP INDEX `Strategy_userId_fkey` ON `Strategy`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('MAX', 'USER') NOT NULL DEFAULT 'USER';

-- 设置用户为最高权限角色
-- UPDATE User
-- SET role = 'Max'
-- WHERE username = 'maxmeng';
