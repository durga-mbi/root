/*
  Warnings:

  - You are about to alter the column `B` on the `_ConfigRoyalPlans` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `plan_id` on the `plan_purchases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `plans_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `plans_master` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[userId,childId]` on the table `royal_qualifier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_ConfigRoyalPlans` DROP FOREIGN KEY `_ConfigRoyalPlans_B_fkey`;

-- DropForeignKey
ALTER TABLE `plan_purchases` DROP FOREIGN KEY `plan_purchases_plan_id_fkey`;

-- AlterTable
ALTER TABLE `_ConfigRoyalPlans` MODIFY `B` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `plan_purchases` MODIFY `plan_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `plans_master` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `royal_qualifier_userId_childId_key` ON `royal_qualifier`(`userId`, `childId`);

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConfigRoyalPlans` ADD CONSTRAINT `_ConfigRoyalPlans_B_fkey` FOREIGN KEY (`B`) REFERENCES `plans_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
