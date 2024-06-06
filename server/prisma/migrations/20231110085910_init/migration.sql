/*
  Warnings:

  - You are about to drop the `_categoriestoproducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_categoriestoproducts` DROP FOREIGN KEY `_categoriesToproducts_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categoriestoproducts` DROP FOREIGN KEY `_categoriesToproducts_B_fkey`;

-- DropTable
DROP TABLE `_categoriestoproducts`;
