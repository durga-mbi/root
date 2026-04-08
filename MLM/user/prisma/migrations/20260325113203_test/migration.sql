/*
  Warnings:

  - You are about to drop the column `A` on the `_configroyalplans` table. All the data in the column will be lost.
  - You are about to drop the column `B` on the `_configroyalplans` table. All the data in the column will be lost.
  - Added the required column `id` to the `_ConfigRoyalPlans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planid` to the `_ConfigRoyalPlans` table without a default value. This is not possible if the table is not empty.
  - Made the column `generateIncomeId` on table `system_income` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_configroyalplans` DROP FOREIGN KEY `_ConfigRoyalPlans_A_fkey`;

-- DropForeignKey
ALTER TABLE `_configroyalplans` DROP FOREIGN KEY `_ConfigRoyalPlans_B_fkey`;

-- DropForeignKey
ALTER TABLE `system_income` DROP FOREIGN KEY `system_income_generateIncomeId_fkey`;

-- DropIndex
DROP INDEX `_ConfigRoyalPlans_AB_unique` ON `_configroyalplans`;

-- AlterTable
ALTER TABLE `_configroyalplans` DROP COLUMN `A`,
    DROP COLUMN `B`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD COLUMN `planid` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `planid`);

-- AlterTable
ALTER TABLE `generate_income` ADD COLUMN `binaryIncome` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    ADD COLUMN `royaltyIncome` DECIMAL(18, 3) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `system_income` MODIFY `generateIncomeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `_ConfigRoyalPlans` ADD CONSTRAINT `_ConfigRoyalPlans_id_fkey` FOREIGN KEY (`id`) REFERENCES `config_table`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConfigRoyalPlans` ADD CONSTRAINT `_ConfigRoyalPlans_planid_fkey` FOREIGN KEY (`planid`) REFERENCES `plans_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_income` ADD CONSTRAINT `system_income_generateIncomeId_fkey` FOREIGN KEY (`generateIncomeId`) REFERENCES `generate_income`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
