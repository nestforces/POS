/*
  Warnings:

  - You are about to drop the column `resetToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- DropIndex
DROP INDEX `users_resetToken_key` ON `users`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `markup` INTEGER NULL,
    ADD COLUMN `sku` VARCHAR(255) NULL,
    MODIFY `quantity` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `resetToken`,
    DROP COLUMN `resetTokenExpiry`,
    DROP COLUMN `status`,
    DROP COLUMN `test`,
    DROP COLUMN `type`;
