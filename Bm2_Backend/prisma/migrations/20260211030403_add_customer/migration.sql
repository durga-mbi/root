/*
  Warnings:

  - The primary key for the `caa1_shop_stock_item_db` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `bar_code` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `brand_code` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `brand_id` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `brand_name` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `cat_name` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `color_name` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `design_name` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `edition` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `fabric_name` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `insert_date` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(40)`.
  - You are about to alter the column `insert_user` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(120)`.
  - You are about to alter the column `item_code` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `item_name` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `mrp_rate` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to alter the column `status` on the `caa1_shop_stock_item_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1)` to `Enum(EnumId(1))`.
  - You are about to drop the `aa_0_admin_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_login_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `indate` on table `caa1_shop_stock_item_db` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `admin_login_history` DROP FOREIGN KEY `admin_login_history_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `user_activity_logs` DROP FOREIGN KEY `user_activity_logs_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_activity_logs` DROP FOREIGN KEY `user_activity_logs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `x4_app_user_addresses` DROP FOREIGN KEY `x4_app_user_addresses_user_id_fkey`;

-- AlterTable
ALTER TABLE `caa1_shop_stock_item_db` DROP PRIMARY KEY,
    ADD COLUMN `unit_id` INTEGER NULL,
    ADD COLUMN `unit_name` VARCHAR(50) NULL,
    ADD COLUMN `update_date` VARCHAR(40) NULL,
    ADD COLUMN `update_user` VARCHAR(120) NULL,
    MODIFY `id` INTEGER NOT NULL,
    MODIFY `bar_code` VARCHAR(100) NULL,
    MODIFY `brand_code` VARCHAR(50) NULL,
    MODIFY `brand_id` VARCHAR(50) NULL,
    MODIFY `brand_name` VARCHAR(50) NULL,
    MODIFY `cat_name` VARCHAR(50) NULL,
    MODIFY `color_name` VARCHAR(50) NULL,
    MODIFY `cur_meter` FLOAT NULL DEFAULT 0,
    MODIFY `cur_qty` FLOAT NULL DEFAULT 0,
    MODIFY `design_name` VARCHAR(50) NULL,
    MODIFY `edition` VARCHAR(100) NULL,
    MODIFY `entry_meter` FLOAT NULL DEFAULT 0,
    MODIFY `entry_qty` FLOAT NULL DEFAULT 0,
    MODIFY `entry_return_meter` FLOAT NULL DEFAULT 0,
    MODIFY `entry_return_qty` FLOAT NULL DEFAULT 0,
    MODIFY `fabric_name` VARCHAR(50) NULL,
    MODIFY `indate` DATE NOT NULL,
    MODIFY `insert_date` VARCHAR(40) NULL,
    MODIFY `insert_user` VARCHAR(120) NULL,
    MODIFY `issue_meter` FLOAT NULL DEFAULT 0,
    MODIFY `issue_qty` FLOAT NULL DEFAULT 0,
    MODIFY `issue_return_meter` FLOAT NULL DEFAULT 0,
    MODIFY `issue_return_qty` FLOAT NULL DEFAULT 0,
    MODIFY `item_code` VARCHAR(50) NULL,
    MODIFY `item_name` VARCHAR(50) NULL,
    MODIFY `mrp_rate` VARCHAR(20) NULL,
    MODIFY `pur_rate` FLOAT NULL,
    MODIFY `sale_rate` FLOAT NULL,
    MODIFY `status` ENUM('1', '0') NOT NULL DEFAULT 1,
    MODIFY `transfer_return_qty` FLOAT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `x6_app_coupon_code` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- DropTable
DROP TABLE `aa_0_admin_db`;

-- DropTable
DROP TABLE `admin_login_history`;

-- DropTable
DROP TABLE `user_activity_logs`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `cb1_customer_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `full_name` VARCHAR(140) NULL,
    `email_id` VARCHAR(100) NULL,
    `contact_no` VARCHAR(100) NULL,
    `whatsapp_no` VARCHAR(500) NULL,
    `gst_number` VARCHAR(150) NULL,
    `otp` VARCHAR(10) NULL,
    `otp_valid_upto` DATETIME(3) NULL,
    `state` INTEGER NULL DEFAULT 19,
    `address` VARCHAR(150) NULL,
    `disper` INTEGER NULL,
    `user_advance` DOUBLE NULL DEFAULT 0,
    `advance_adjust` DOUBLE NULL DEFAULT 0,
    `remaining_advance` DOUBLE NULL DEFAULT 0,
    `total_transaction` DOUBLE NULL DEFAULT 0,
    `get_point` DOUBLE NULL DEFAULT 0,
    `use_point` DOUBLE NULL DEFAULT 0,
    `balance_point_use` DOUBLE NULL DEFAULT 0,
    `indate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` INTEGER NOT NULL DEFAULT 1,
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `x4_app_user_addresses` ADD CONSTRAINT `x4_app_user_addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `cb1_customer_db`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
