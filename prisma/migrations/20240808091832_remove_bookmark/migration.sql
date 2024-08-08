/*
  Warnings:

  - You are about to drop the `Bookmark` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Bookmark` DROP FOREIGN KEY `Bookmark_parentId_fkey`;

-- DropTable
DROP TABLE `Bookmark`;
