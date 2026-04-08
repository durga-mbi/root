/*
  Warnings:

  - You are about to drop the column `cat_image` on the `aa4_category_db` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `aa4_category_db` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.
  - You are about to drop the column `otp` on the `cb1_customer_db` table. All the data in the column will be lost.
  - You are about to drop the column `otp_valid_upto` on the `cb1_customer_db` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `cb1_customer_db` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(46))`.
  - You are about to alter the column `is_display` on the `x1_app_product_register` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1)` to `Enum(EnumId(3))`.
  - You are about to alter the column `updated_at` on the `x1_app_product_register` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `x3_app_product_ratings` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `x4_app_user_addresses` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `x6_app_coupon_code` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to drop the `product_image_register` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_register` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[product_id]` on the table `x1_app_product_register` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cat_code` on table `aa4_category_db` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `product_image_register` DROP FOREIGN KEY `product_image_register_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `x4_app_user_addresses` DROP FOREIGN KEY `x4_app_user_addresses_user_id_fkey`;

-- DropIndex
DROP INDEX `x1_app_product_register_product_id_idx` ON `x1_app_product_register`;

-- DropIndex
DROP INDEX `x3_app_product_ratings_product_id_idx` ON `x3_app_product_ratings`;

-- AlterTable
ALTER TABLE `aa4_category_db` DROP COLUMN `cat_image`,
    ADD COLUMN `add_to_website` ENUM('0', '1') NULL DEFAULT '0',
    ADD COLUMN `category_image` VARCHAR(255) NULL,
    ADD COLUMN `priority` INTEGER NULL DEFAULT 0,
    ADD COLUMN `slugs` VARCHAR(255) NULL,
    MODIFY `cat_name` VARCHAR(180) NULL,
    MODIFY `cat_code` VARCHAR(100) NOT NULL,
    ALTER COLUMN `disorder` DROP DEFAULT,
    MODIFY `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    MODIFY `insert_date` VARCHAR(40) NULL,
    MODIFY `insert_user` VARCHAR(120) NULL,
    MODIFY `update_date` VARCHAR(40) NULL,
    MODIFY `update_user` VARCHAR(120) NULL;

-- AlterTable
ALTER TABLE `caa1_shop_stock_item_db` ADD COLUMN `markupamt` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `cb1_customer_db` DROP COLUMN `otp`,
    DROP COLUMN `otp_valid_upto`,
    MODIFY `user_advance` FLOAT NULL DEFAULT 0,
    MODIFY `advance_adjust` FLOAT NULL DEFAULT 0,
    MODIFY `remaining_advance` FLOAT NULL DEFAULT 0,
    MODIFY `indate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `status` ENUM('1', '0') NOT NULL DEFAULT '1';

-- AlterTable
ALTER TABLE `x1_app_product_register` MODIFY `is_display` ENUM('0', '1') NULL DEFAULT '1',
    MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `x3_app_product_ratings` MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `x4_app_user_addresses` MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `x6_app_coupon_code` MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL;

-- DropTable
DROP TABLE `product_image_register`;

-- DropTable
DROP TABLE `product_register`;

-- CreateTable
CREATE TABLE `aa13_customer_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NOT NULL,
    `cust_type` VARCHAR(10) NULL,
    `party_code` VARCHAR(10) NULL,
    `full_name` VARCHAR(140) NULL,
    `alias` VARCHAR(140) NULL,
    `contact_no` VARCHAR(100) NULL,
    `whatsapp_no` VARCHAR(500) NULL,
    `email_id` VARCHAR(100) NULL,
    `gst_no` VARCHAR(150) NULL,
    `pan_no` VARCHAR(20) NULL,
    `state` INTEGER NULL DEFAULT 19,
    `area` VARCHAR(50) NULL,
    `location` VARCHAR(100) NULL,
    `addressone` VARCHAR(150) NULL,
    `addrestwo` VARCHAR(20) NULL,
    `userid` VARCHAR(50) NULL,
    `password` VARCHAR(50) NULL,
    `autonoid` INTEGER NULL DEFAULT 1,
    `ret_autono` INTEGER NULL DEFAULT 1,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,
    `otp` VARCHAR(255) NULL,
    `otp_valid_upto` DATETIME(0) NULL,
    `refresh_token` VARCHAR(255) NULL,
    `profile_image` VARCHAR(255) NULL,
    `indate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `aa13_customer_db_com_id_key`(`com_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x2_app_product_img_register` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `proimgs` VARCHAR(255) NULL,
    `status` ENUM('0', '1') NULL DEFAULT '1',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa11_design_register_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NOT NULL DEFAULT 1,
    `warehouse_id` INTEGER NOT NULL DEFAULT 1,
    `brandid` INTEGER NULL,
    `design_name` VARCHAR(100) NULL,
    `item_name` VARCHAR(150) NULL DEFAULT '',
    `color_id` INTEGER NULL DEFAULT 45,
    `unitid` INTEGER NULL DEFAULT 6,
    `size_id` INTEGER NULL,
    `version` VARCHAR(110) NULL,
    `image` VARCHAR(140) NULL,
    `other_images` TEXT NULL,
    `design_desc` VARCHAR(200) NULL,
    `priority` INTEGER NULL DEFAULT 0,
    `slugs` VARCHAR(255) NULL,
    `add_to_website` ENUM('0', '1') NULL DEFAULT '0',
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    INDEX `id`(`id`, `brandid`, `design_name`, `color_id`, `unitid`),
    INDEX `idx_com_warehouse`(`com_id`, `warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa12_gstper_register_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gstper` VARCHAR(100) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa14_employee_register_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emply_name` VARCHAR(100) NULL,
    `mobile_number` VARCHAR(100) NULL,
    `typeid` INTEGER NULL,
    `link_user` INTEGER NULL DEFAULT 0,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    INDEX `id`(`id`, `emply_name`, `mobile_number`, `typeid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa15_shop_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `cust_type` VARCHAR(10) NULL,
    `party_code` VARCHAR(10) NULL,
    `full_name` VARCHAR(140) NULL,
    `alias` VARCHAR(140) NULL,
    `contact_no` VARCHAR(100) NULL,
    `whatsapp_no` VARCHAR(500) NULL,
    `email_id` VARCHAR(100) NULL,
    `gst_no` VARCHAR(150) NULL,
    `pan_no` VARCHAR(20) NULL,
    `state` INTEGER NULL DEFAULT 19,
    `area` VARCHAR(50) NULL,
    `location` VARCHAR(100) NULL,
    `addressone` VARCHAR(150) NULL,
    `addrestwo` VARCHAR(20) NULL,
    `userid` VARCHAR(50) NULL,
    `password` VARCHAR(50) NULL,
    `autonoid` INTEGER NULL DEFAULT 1,
    `common_id` INTEGER NULL DEFAULT 1,
    `ret_autono` INTEGER NULL DEFAULT 1,
    `order_autono` INTEGER NULL DEFAULT 1,
    `adjust_autono` INTEGER NULL DEFAULT 1,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `cust_type`, `party_code`, `full_name`, `alias`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa16_emp_type_tbl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_type` VARCHAR(50) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa17_tran_mode_tbl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mode_type` VARCHAR(50) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa18_item_discount_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `brand_id` INTEGER NULL,
    `design_id` INTEGER NULL,
    `item_id` INTEGER NULL,
    `edition` VARCHAR(100) NULL,
    `mrp_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `mrp_discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `mrp_discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `online_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `online_discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `online_discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    UNIQUE INDEX `uk_item_discount`(`category_id`, `brand_id`, `design_id`, `item_id`, `edition`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa1_brand_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `warehouse_id` INTEGER NOT NULL DEFAULT 1,
    `party_id` INTEGER NULL,
    `brand_code` VARCHAR(10) NULL,
    `brand_name` VARCHAR(100) NULL,
    `eidition` VARCHAR(150) NULL,
    `mrp_rate` VARCHAR(100) NULL,
    `sales_rate` VARCHAR(100) NULL,
    `sales_add` VARCHAR(20) NULL DEFAULT '0',
    `online_rate` VARCHAR(100) NULL,
    `online_add` VARCHAR(20) NULL DEFAULT '0',
    `pur_rate` VARCHAR(10) NULL,
    `rd_rate` VARCHAR(20) NULL,
    `discount` VARCHAR(100) NULL,
    `act_pur_rate` VARCHAR(100) NULL,
    `remarks` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `slugs` VARCHAR(255) NULL,
    `priority` INTEGER NULL DEFAULT 0,
    `add_to_website` ENUM('0', '1') NULL DEFAULT '0',
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    INDEX `id`(`id`, `party_id`, `brand_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa2_color_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `color_name` VARCHAR(140) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `color_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa3_fabric_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `fabric_name` VARCHAR(140) NULL,
    `fabric_desc` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `fabric_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa5_unit_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `unit_name` VARCHAR(140) NULL,
    `unit_desc` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `unit_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa6_size_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NOT NULL DEFAULT 1,
    `size_name` VARCHAR(100) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    INDEX `idx_com`(`com_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa7_transporter_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `full_name` VARCHAR(140) NULL,
    `contact_no` VARCHAR(20) NULL,
    `whatsapp_no` VARCHAR(20) NULL,
    `email_id` VARCHAR(100) NULL,
    `location` VARCHAR(100) NULL,
    `gst_no` VARCHAR(150) NULL,
    `gst_type` VARCHAR(150) NULL,
    `aadhar_no` VARCHAR(20) NULL,
    `pan_no` VARCHAR(20) NULL,
    `state` INTEGER NULL,
    `area` VARCHAR(50) NULL,
    `address` TEXT NULL,
    `trn_moode` VARCHAR(50) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `full_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa8_party_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `warehouse_id` INTEGER NOT NULL DEFAULT 1,
    `party_code` VARCHAR(10) NULL,
    `full_name` VARCHAR(140) NULL,
    `alias` VARCHAR(140) NULL,
    `contact_no` VARCHAR(100) NULL,
    `whatsapp_no` VARCHAR(500) NULL,
    `email_id` VARCHAR(100) NULL,
    `gst_no` VARCHAR(150) NULL,
    `pan_no` VARCHAR(20) NULL,
    `state` INTEGER NULL DEFAULT 19,
    `area` VARCHAR(50) NULL,
    `location` VARCHAR(100) NULL,
    `addressone` VARCHAR(150) NULL,
    `addrestwo` VARCHAR(20) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `party_code`, `full_name`, `alias`, `contact_no`, `state`),
    INDEX `idx_com_warehouse`(`com_id`, `warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa9_warehouse_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL DEFAULT 1,
    `full_name` VARCHAR(200) NULL,
    `alias` VARCHAR(100) NULL,
    `contact_no` VARCHAR(50) NULL,
    `whatsapp_no` VARCHAR(20) NULL,
    `email_id` VARCHAR(100) NULL,
    `gst_no` VARCHAR(50) NULL,
    `pan_no` VARCHAR(30) NULL,
    `state` INTEGER NULL,
    `area` VARCHAR(100) NULL,
    `location` VARCHAR(200) NULL,
    `addressone` VARCHAR(250) NULL,
    `addrestwo` VARCHAR(250) NULL,
    `status` TINYINT NULL DEFAULT 1,
    `insert_date` VARCHAR(20) NULL,
    `insert_user` VARCHAR(100) NULL,
    `update_date` VARCHAR(20) NULL,
    `update_user` VARCHAR(100) NULL,

    INDEX `idx_company_id`(`company_id`),
    INDEX `status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b12_admin_log_history_tbl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loguser` VARCHAR(60) NULL,
    `session_id` VARCHAR(150) NULL,
    `log_date` DATE NULL,
    `log_time` VARCHAR(20) NULL,
    `logout_date` DATE NULL,
    `logout_time` VARCHAR(20) NULL,
    `logip` VARCHAR(50) NULL,
    `logmachine` VARCHAR(140) NULL,
    `motherboard_name` VARCHAR(250) NULL,
    `logstatus` VARCHAR(150) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(50) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ba1_stock_item_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `warehouse_id` INTEGER NOT NULL DEFAULT 1,
    `bar_code` VARCHAR(100) NOT NULL,
    `stoct_update_date` DATE NULL,
    `entry_purrate` DOUBLE NULL DEFAULT 0,
    `entry_mrprate` DOUBLE NULL DEFAULT 0,
    `entry_salerate` DOUBLE NULL DEFAULT 0,
    `entry_onlinerate` DOUBLE NULL DEFAULT 0,
    `praty_id` INTEGER NULL,
    `invoice_no` VARCHAR(80) NULL,
    `purid` INTEGER NULL DEFAULT 0,
    `item_id` INTEGER NULL,
    `brand_id` INTEGER NULL,
    `edition` VARCHAR(100) NULL,
    `note` VARCHAR(500) NULL,
    `design_id` INTEGER NULL,
    `size_id` VARCHAR(50) NULL,
    `color_id` INTEGER NULL,
    `fabric_id` INTEGER NULL,
    `cat_id` INTEGER NULL,
    `unit_id` INTEGER NULL,
    `con_ratio` FLOAT NULL DEFAULT 0,
    `pur_rate` DOUBLE NULL DEFAULT 0,
    `rd_amt` FLOAT NULL,
    `dis_per` FLOAT NULL,
    `sp_dis_per` FLOAT NULL,
    `gst_per` FLOAT NULL,
    `gst_amt` FLOAT NOT NULL DEFAULT 0,
    `is_faction` INTEGER NULL DEFAULT 0,
    `mrp_rate` DOUBLE NULL DEFAULT 0,
    `sale_rate` DOUBLE NULL DEFAULT 0,
    `online_rate` DOUBLE NULL DEFAULT 0,
    `markupamt` DOUBLE NOT NULL DEFAULT 0,
    `entry_meter` FLOAT NULL DEFAULT 0,
    `entry_qty` FLOAT NULL DEFAULT 0,
    `entry_return_meter` FLOAT NULL DEFAULT 0,
    `entry_return_qty` FLOAT NULL DEFAULT 0,
    `issue_meter` FLOAT NULL DEFAULT 0,
    `issue_qty` FLOAT NULL DEFAULT 0,
    `issue_return_meter` FLOAT NULL DEFAULT 0,
    `issue_return_qty` FLOAT NULL DEFAULT 0,
    `stock_transfer` FLOAT NULL DEFAULT 0,
    `stock_return` FLOAT NULL DEFAULT 0,
    `mate_issued` FLOAT NULL DEFAULT 0,
    `issued_recived` FLOAT NULL DEFAULT 0,
    `value_addition` FLOAT NULL DEFAULT 0,
    `cur_meter` FLOAT NULL DEFAULT 0,
    `cur_qty` FLOAT NULL DEFAULT 0,
    `additon_image` VARCHAR(200) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `item_remarks` TEXT NULL,
    `indate` DATE NOT NULL,
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `bar_code`, `praty_id`, `invoice_no`, `item_id`, `brand_id`, `edition`, `design_id`, `color_id`, `fabric_id`, `cat_id`, `unit_id`),
    INDEX `index1`(`id`, `bar_code`, `praty_id`, `item_id`, `brand_id`, `design_id`, `color_id`, `fabric_id`, `cat_id`, `unit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ba2_purchase_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `warehouse_id` INTEGER NOT NULL DEFAULT 1,
    `incno` INTEGER NOT NULL,
    `groc_entry` INTEGER NULL DEFAULT 0,
    `orderid` VARCHAR(20) NULL,
    `invoiceid` VARCHAR(20) NULL,
    `inv_type` INTEGER NULL DEFAULT 0,
    `pur_type` INTEGER NOT NULL DEFAULT 1,
    `grntype` VARCHAR(10) NULL,
    `grndate` DATE NULL,
    `party_id` VARCHAR(10) NULL,
    `invno` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `lrno` VARCHAR(50) NULL,
    `lrdate` DATE NULL,
    `transporter_id` VARCHAR(50) NULL,
    `mode_transport` VARCHAR(50) NULL,
    `tot_qty` FLOAT NULL,
    `tot_amt` FLOAT NULL,
    `pack_charge` FLOAT NULL DEFAULT 0,
    `disper` FLOAT NULL,
    `disamt` FLOAT NULL,
    `tax_amount` FLOAT NULL DEFAULT 0,
    `other_charge` FLOAT NULL DEFAULT 0,
    `lessper` FLOAT NULL,
    `lessamt` FLOAT NULL,
    `freight` FLOAT NULL,
    `round_off` FLOAT NULL,
    `taxvalue` FLOAT NULL,
    `gst_per` FLOAT NULL,
    `gst_amt` FLOAT NULL,
    `grand_tot` FLOAT NULL,
    `payment_amt` FLOAT NULL DEFAULT 0,
    `payment_billno` INTEGER NULL,
    `bankdt` INTEGER NULL,
    `desc_text` TEXT NULL,
    `roundof_type` INTEGER NULL DEFAULT 1,
    `jsan_data` TEXT NULL,
    `excel_file_name` VARCHAR(250) NULL,
    `pdf_file` VARCHAR(250) NULL,
    `entry_date` DATE NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,
    `entydatetime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id`(`id`, `incno`, `orderid`, `invoiceid`, `inv_type`, `party_id`, `invno`, `transporter_id`),
    PRIMARY KEY (`incno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ba3_purchase_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `invtype` INTEGER NULL,
    `purtype` INTEGER NOT NULL DEFAULT 1,
    `itemid` INTEGER NULL,
    `batchno` VARCHAR(100) NULL,
    `mfgdate` DATE NULL,
    `expirydate` DATE NULL,
    `serialimeino` VARCHAR(100) NULL,
    `warrantyperiod` VARCHAR(100) NULL,
    `modelno` VARCHAR(100) NULL,
    `powervoltage` VARCHAR(100) NULL,
    `hsncode` VARCHAR(100) NULL DEFAULT '',
    `brand_id` INTEGER NULL,
    `edition` VARCHAR(100) NULL,
    `design_id` INTEGER NULL,
    `barcode` VARCHAR(30) NULL,
    `size` VARCHAR(100) NULL DEFAULT '',
    `color_id` INTEGER NULL,
    `fabric_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `unit_id` INTEGER NULL,
    `meter` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `free_qty` VARCHAR(50) NULL,
    `rate` DOUBLE NULL,
    `rd_amt` FLOAT NULL,
    `disc_per` FLOAT NULL,
    `disc_amt` FLOAT NULL DEFAULT 0,
    `sp_dis` FLOAT NULL,
    `pursinamt` FLOAT NOT NULL DEFAULT 0,
    `totalamt` FLOAT NULL,
    `gstper` FLOAT NULL,
    `gstamt` FLOAT NOT NULL DEFAULT 0,
    `purchase_amt` FLOAT NULL DEFAULT 0,
    `with_faction` INTEGER NULL DEFAULT 0,
    `mrp_price` DOUBLE NULL,
    `sale_price` DOUBLE NULL,
    `online_price` DOUBLE NULL,
    `markupamt` DOUBLE NOT NULL DEFAULT 0,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `invtype`, `itemid`, `brand_id`, `design_id`, `color_id`, `fabric_id`, `category_id`, `unit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ba4_purchase_excel_faild_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(255) NOT NULL,
    `invoice_id` VARCHAR(100) NOT NULL,
    `orderid` VARCHAR(100) NULL,
    `excel_file_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ba4_stock_transfer_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `incno` INTEGER NOT NULL,
    `invoice_no` VARCHAR(50) NOT NULL,
    `from_warehouse` INTEGER NOT NULL,
    `to_warehouse` INTEGER NOT NULL,
    `transfer_date` DATE NOT NULL,
    `total_qty` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `total_amt` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `remarks` VARCHAR(255) NULL,
    `app_status` TINYINT NULL DEFAULT 0,
    `insert_date` DATETIME(0) NOT NULL,
    `insert_user` INTEGER NOT NULL,

    UNIQUE INDEX `uk_incno`(`incno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ba5_stock_transfer_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `incno` INTEGER NOT NULL,
    `barcode` VARCHAR(50) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `brand_id` INTEGER NOT NULL,
    `design_id` INTEGER NOT NULL,
    `qty` DECIMAL(10, 2) NOT NULL,
    `rate` DECIMAL(10, 2) NOT NULL,
    `totalamt` DECIMAL(12, 2) NOT NULL,
    `app_status` ENUM('0', '1') NOT NULL DEFAULT '0',
    `insert_date` DATETIME(0) NOT NULL,
    `insert_user` INTEGER NOT NULL,

    INDEX `idx_barcode`(`barcode`),
    INDEX `idx_incno`(`incno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `backup_cc1_shop_invoice_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `serialno` INTEGER NULL DEFAULT 0,
    `incno` INTEGER NULL,
    `invoice_no` VARCHAR(100) NULL,
    `invdate` DATE NULL,
    `inv_time` VARCHAR(50) NULL,
    `invtype` INTEGER NULL DEFAULT 1,
    `partyid` INTEGER NULL,
    `gsttype` ENUM('1', '0') NOT NULL DEFAULT '1',
    `totqty` FLOAT NULL,
    `tottaxamt` FLOAT NULL,
    `totamt` FLOAT NULL,
    `delcharge` FLOAT NULL,
    `invoice_amt` FLOAT NULL,
    `cashamt` FLOAT NULL,
    `cardamt` FLOAT NULL,
    `carddt` VARCHAR(100) NULL,
    `walletamt` FLOAT NULL,
    `chequeamt` FLOAT NULL,
    `gift_card_amt` FLOAT NULL DEFAULT 0,
    `rutn_inv_amt` FLOAT NULL,
    `totpayamt` FLOAT NULL,
    `lessamt` FLOAT NULL,
    `dueamt` FLOAT NULL,
    `refundamt` FLOAT NULL,
    `payment_amt` FLOAT NULL DEFAULT 0,
    `pay_mode` VARCHAR(20) NULL,
    `billby` INTEGER NULL,
    `salesman` INTEGER NULL,
    `remarks` VARCHAR(200) NULL,
    `gift_card_no` VARCHAR(20) NULL,
    `desc_text` TEXT NULL,
    `advance_recived` FLOAT NULL,
    `advance_recived_date` DATE NULL,
    `advance_adjust` FLOAT NULL,
    `advance_adjust_date` DATE NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `serialno`, `incno`, `invoice_no`, `invtype`, `partyid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bb1_invoice_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` VARCHAR(10) NULL,
    `incno` VARCHAR(10) NULL,
    `invno` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `invtype` VARCHAR(10) NULL DEFAULT '1',
    `partyid` VARCHAR(10) NULL,
    `billby` VARCHAR(100) NULL,
    `packedby` VARCHAR(100) NULL,
    `carrier` VARCHAR(100) NULL,
    `salesman` VARCHAR(100) NULL,
    `deliby` VARCHAR(100) NULL,
    `gsttype` ENUM('1', '0') NOT NULL DEFAULT '1',
    `totqty` FLOAT NULL,
    `tottaxamt` FLOAT NULL,
    `totamt` FLOAT NULL,
    `delcharge` FLOAT NULL,
    `invoice_amt` FLOAT NULL,
    `payment_amt` FLOAT NULL DEFAULT 0,
    `shiping_address` TEXT NULL,
    `pay_mode` VARCHAR(20) NULL,
    `bank_name` VARCHAR(100) NULL,
    `acc_no` VARCHAR(100) NULL,
    `desc_text` TEXT NULL,
    `payment_billno` VARCHAR(50) NULL,
    `approve_dt` ENUM('1', '0') NOT NULL DEFAULT '0',
    `jsan_date` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `invno`, `invdate`, `invtype`, `partyid`, `billby`, `packedby`, `carrier`, `salesman`, `deliby`, `gsttype`, `payment_billno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bb2_invoice_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` VARCHAR(10) NULL,
    `incno` VARCHAR(20) NULL,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `rtqty` FLOAT NULL DEFAULT 0,
    `exsitqty` FLOAT NULL DEFAULT 0,
    `rate` FLOAT NULL,
    `disper` FLOAT NULL,
    `taxamt` FLOAT NULL,
    `gstper` FLOAT NULL,
    `totalamt` FLOAT NULL,
    `note` VARCHAR(100) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bb3_tax_invoice_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NOT NULL,
    `invno` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `invtype` INTEGER NULL DEFAULT 1,
    `partyid` INTEGER NULL,
    `billby` INTEGER NULL,
    `packedby` INTEGER NULL,
    `carrier` VARCHAR(100) NULL,
    `salesman` INTEGER NULL,
    `deliby` INTEGER NULL,
    `gsttype` ENUM('1', '0') NOT NULL DEFAULT '1',
    `totqty` FLOAT NULL,
    `tottaxamt` FLOAT NULL,
    `totamt` FLOAT NULL,
    `delcharge` FLOAT NULL,
    `round_off` FLOAT NULL DEFAULT 0,
    `roundof_type` INTEGER NULL DEFAULT 1,
    `invoice_amt` FLOAT NULL,
    `payment_amt` FLOAT NULL DEFAULT 0,
    `card_amt` DOUBLE NULL DEFAULT 0,
    `wallet_amt` DOUBLE NULL DEFAULT 0,
    `neft_amt` DOUBLE NULL DEFAULT 0,
    `shiping_address` TEXT NULL,
    `pay_mode` VARCHAR(20) NULL,
    `bank_name` VARCHAR(100) NULL,
    `acc_no` VARCHAR(100) NULL,
    `desc_text` TEXT NULL,
    `payment_billno` VARCHAR(50) NULL,
    `jsan_data` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `invno`, `invdate`, `invtype`, `partyid`, `billby`, `packedby`, `carrier`, `salesman`, `deliby`, `gsttype`, `payment_billno`),
    PRIMARY KEY (`incno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bb4_tax_invoice_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `rtqty` FLOAT NULL DEFAULT 0,
    `exsitqty` FLOAT NULL DEFAULT 0,
    `rate` FLOAT NULL,
    `disper` FLOAT NULL,
    `taxamt` FLOAT NULL,
    `gstper` FLOAT NULL,
    `totalamt` FLOAT NULL,
    `note` VARCHAR(100) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bd1_purchase_return_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NOT NULL,
    `invno` VARCHAR(200) NULL,
    `purches_type` INTEGER NOT NULL DEFAULT 0,
    `party_id` VARCHAR(10) NULL,
    `returndate` DATE NULL,
    `transporter_id` VARCHAR(50) NULL,
    `mode_transport` VARCHAR(50) NULL,
    `invoiceno` VARCHAR(100) NULL,
    `debitnoteno` VARCHAR(100) NULL,
    `lrno` VARCHAR(100) NULL,
    `lrdate` DATE NULL,
    `tot_qty` FLOAT NULL,
    `tot_amt` FLOAT NULL,
    `freight` FLOAT NULL,
    `round_off` FLOAT NULL,
    `taxvalue` FLOAT NULL,
    `grand_tot` FLOAT NULL,
    `desc_text` TEXT NULL,
    `roundof_type` INTEGER NULL DEFAULT 1,
    `entry_date` DATE NULL,
    `jsan_data` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `invno`, `party_id`, `returndate`, `transporter_id`),
    PRIMARY KEY (`incno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bd2_purchase_return_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `rate` FLOAT NULL,
    `rdamt` FLOAT NULL,
    `disper` FLOAT NULL,
    `spdisper` FLOAT NULL,
    `gstper` FLOAT NULL,
    `gstamt` FLOAT NULL,
    `totalamt` FLOAT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ca1_stock_tran_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `warehouseid` INTEGER NOT NULL DEFAULT 1,
    `incno` INTEGER NOT NULL,
    `invoice_no` VARCHAR(20) NULL,
    `tran_date` DATE NULL,
    `partyid` INTEGER NULL,
    `totqty` FLOAT NULL,
    `totamt` FLOAT NULL,
    `app_type` VARCHAR(20) NULL,
    `desc_text` TEXT NULL,
    `bill_comment` TEXT NULL,
    `app_status` VARCHAR(20) NULL,
    `jsan_data` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `entry_time` VARCHAR(100) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `incno`, `partyid`),
    PRIMARY KEY (`incno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ca2_stock_tran_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `rate` FLOAT NULL,
    `totalamt` FLOAT NULL,
    `appstatus` ENUM('1', '0') NOT NULL DEFAULT '1',
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `barcode`(`barcode`),
    INDEX `id`(`id`, `incno`, `barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cable_interface_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dis_order` INTEGER NULL DEFAULT 0,
    `interface_name` VARCHAR(140) NULL,
    `sub_interface` VARCHAR(140) NOT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(140) NULL,
    `insert_time` VARCHAR(140) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cable_user_permission_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `interface_id` INTEGER NULL,
    `insert_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `edit_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `delete_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `view_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(140) NULL,
    `insert_time` VARCHAR(140) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cb2_shop_employee_register_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_id` INTEGER NULL DEFAULT 0,
    `emply_name` VARCHAR(100) NULL,
    `mobile_number` VARCHAR(100) NULL,
    `typeid` INTEGER NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    INDEX `id`(`id`, `emply_name`, `mobile_number`, `typeid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cb3_shop_discount_register_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_id` INTEGER NULL DEFAULT 0,
    `discount` VARCHAR(100) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cc1_shop_invoice_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryid` VARCHAR(50) NULL,
    `comid` INTEGER NULL,
    `serialno` INTEGER NULL DEFAULT 0,
    `incno` INTEGER NOT NULL,
    `invoice_no` VARCHAR(100) NULL,
    `test_inv_no` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `inv_time` VARCHAR(50) NULL,
    `invtype` INTEGER NULL DEFAULT 1,
    `partyid` INTEGER NULL,
    `gsttype` ENUM('1', '0') NOT NULL DEFAULT '1',
    `totqty` DOUBLE NULL,
    `tottaxamt` DOUBLE NULL,
    `totamt` DOUBLE NULL,
    `delcharge` DOUBLE NULL,
    `invoice_amt` DOUBLE NULL,
    `cashamt` DOUBLE NULL,
    `cardamt` DOUBLE NULL,
    `upiamt` DOUBLE NULL,
    `neftamt` DOUBLE NULL,
    `carddt` VARCHAR(100) NULL,
    `walletamt` DOUBLE NULL,
    `al_bank_amt` DOUBLE NULL DEFAULT 0,
    `al_bank_mob` VARCHAR(20) NULL,
    `chequeamt` DOUBLE NULL,
    `gift_card_amt` DOUBLE NULL DEFAULT 0,
    `redeempoint` INTEGER NULL DEFAULT 0,
    `redeemamt` DOUBLE NULL DEFAULT 0,
    `rtn_invoice` VARCHAR(30) NULL,
    `rutn_inv_amt` DOUBLE NULL,
    `totpayamt` DOUBLE NULL,
    `lessamt` DOUBLE NULL,
    `dueamt` DOUBLE NULL,
    `refundamt` DOUBLE NULL,
    `payment_amt` DOUBLE NULL DEFAULT 0,
    `pay_mode` VARCHAR(20) NULL,
    `billby` INTEGER NULL,
    `salesman` INTEGER NULL,
    `remarks` VARCHAR(200) NULL,
    `gift_card_no` VARCHAR(20) NULL,
    `desc_text` TEXT NULL,
    `advance_recived` DOUBLE NULL,
    `advance_recived_date` DATE NULL,
    `advance_adjust` DOUBLE NULL,
    `advance_adjust_date` DATE NULL,
    `reward_point` INTEGER NULL DEFAULT 0,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `serialno`, `incno`, `invoice_no`, `invtype`, `partyid`),
    INDEX `id_2`(`id`, `comid`, `incno`, `partyid`, `invtype`),
    INDEX `partyid`(`partyid`),
    PRIMARY KEY (`incno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cc2_shop_invoice_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `invdate` DATE NULL,
    `barcodeid` INTEGER NULL DEFAULT 0,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `return_qty` FLOAT NULL DEFAULT 0,
    `exsit_return_qty` FLOAT NULL DEFAULT 0,
    `rate` FLOAT NULL,
    `disper` FLOAT NULL,
    `taxamt` FLOAT NULL,
    `gstper` FLOAT NULL,
    `comment` VARCHAR(100) NULL,
    `is_free` INTEGER NULL DEFAULT 0,
    `ismarkdown` ENUM('0', '1') NOT NULL DEFAULT '0',
    `markdownamt` FLOAT NOT NULL DEFAULT 0,
    `draftid_markdowid` INTEGER NOT NULL DEFAULT 0,
    `totalamt` FLOAT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `incno`, `barcode`),
    INDEX `incno`(`incno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cd1_shop_invoice_return` (
    `id` INTEGER NOT NULL,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `rn_invno` VARCHAR(100) NULL,
    `inv_no` INTEGER NULL,
    `inv_date` DATE NULL,
    `inv_time` VARCHAR(50) NULL,
    `return_date` DATE NULL,
    `return_time` VARCHAR(50) NULL,
    `partyid` INTEGER NULL,
    `gsttype` ENUM('1', '0') NOT NULL DEFAULT '1',
    `totqty` FLOAT NULL,
    `tottaxamt` FLOAT NULL,
    `totamt` FLOAT NULL,
    `delcharge` FLOAT NULL,
    `roundof_type` INTEGER NULL DEFAULT 1,
    `roundoff_val` FLOAT NULL DEFAULT 0,
    `invoice_amt` FLOAT NULL,
    `payment_amt` FLOAT NULL DEFAULT 0,
    `pay_mode` VARCHAR(20) NULL,
    `desc_text` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cd2_shop_invoice_return_details` (
    `id` INTEGER NOT NULL,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `barcodeid` INTEGER NULL DEFAULT 0,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `return_qty` FLOAT NULL DEFAULT 0,
    `rate` FLOAT NULL,
    `disper` FLOAT NULL,
    `taxamt` FLOAT NULL,
    `gstper` FLOAT NULL,
    `totalamt` FLOAT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `da1_change_selling_price_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(50) NULL,
    `change_username` VARCHAR(150) NULL,
    `oldmrpprice` FLOAT NULL,
    `newmrpprice` FLOAT NULL,
    `oldsaleprice` FLOAT NULL,
    `newsaleprice` FLOAT NULL,
    `oldonlineprice` FLOAT NULL,
    `newonlineprice` FLOAT NULL,
    `remarks` TEXT NULL,
    `entey_date` DATE NULL,
    `entey_time` VARCHAR(50) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ea1_shop_stock_tran_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `invoice_no` VARCHAR(10) NULL,
    `tran_date` DATE NULL,
    `partyid` INTEGER NULL,
    `totqty` FLOAT NULL,
    `totamt` FLOAT NULL,
    `app_type` VARCHAR(20) NULL,
    `desc_text` TEXT NULL,
    `app_status` VARCHAR(20) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `incno`, `invoice_no`, `partyid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ea2_shop_stock_tran_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `rate` FLOAT NULL,
    `totalamt` FLOAT NULL,
    `appstatus` ENUM('1', '0') NOT NULL DEFAULT '1',
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `incno`, `barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grocery_purchase_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NOT NULL,
    `invtype` TINYINT NULL DEFAULT 2,
    `itemid` INTEGER NULL,
    `brand_id` INTEGER NULL,
    `edition` VARCHAR(100) NULL,
    `design_id` INTEGER NULL,
    `barcode` VARCHAR(50) NULL,
    `color_id` INTEGER NULL,
    `fabric_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `item_name` VARCHAR(255) NULL,
    `hsn_code` VARCHAR(20) NULL,
    `unit_id` INTEGER NULL,
    `meter` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `unit_name` VARCHAR(50) NULL,
    `qty` INTEGER NULL DEFAULT 0,
    `free_qty` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `rate` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `rd_amt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `disc_per` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `disc_amt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `sp_dis` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `gstper` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `gstamt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `purchase_amt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `with_faction` TINYINT NULL DEFAULT 0,
    `mrp_price` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `sale_price` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `online_price` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `status` TINYINT NULL DEFAULT 1,
    `totalamt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `insert_date` DATE NULL,
    `insert_user` VARCHAR(100) NULL,
    `update_date` VARCHAR(20) NULL,
    `update_user` VARCHAR(100) NULL,

    INDEX `barcode`(`barcode`),
    INDEX `incno`(`incno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grocery_purchase_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NOT NULL,
    `groc_entry` TINYINT NULL DEFAULT 0,
    `orderid` VARCHAR(100) NULL,
    `invoiceid` VARCHAR(100) NULL,
    `inv_type` TINYINT NULL DEFAULT 2,
    `grntype` VARCHAR(50) NULL,
    `grndate` DATE NULL,
    `party_id` INTEGER NULL,
    `invno` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `lrno` VARCHAR(50) NULL,
    `lrdate` DATE NULL,
    `transporter_id` INTEGER NULL,
    `mode_transport` VARCHAR(50) NULL,
    `tot_qty` INTEGER NULL DEFAULT 0,
    `tot_amt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `pack_charge` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `disper` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `disamt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `tax_amount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `other_charge` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `lessper` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `lessamt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `freight` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `round_off` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `taxvalue` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `gst_per` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `gst_amt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `grand_tot` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `payment_amt` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `payment_billno` VARCHAR(100) NULL,
    `bankdt` DATE NULL,
    `desc_text` TEXT NULL,
    `roundof_type` TINYINT NULL DEFAULT 1,
    `jsan_data` TEXT NULL,
    `entry_date` DATE NULL,
    `status` TINYINT NULL DEFAULT 1,
    `insert_date` DATE NULL,
    `insert_user` VARCHAR(100) NULL,
    `update_date` VARCHAR(20) NULL,
    `update_user` VARCHAR(100) NULL,
    `entydatetime` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `incno`(`incno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grocery_stock_item_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(50) NOT NULL,
    `item_name` VARCHAR(255) NOT NULL,
    `hsn_code` VARCHAR(20) NULL,
    `unit_id` INTEGER NULL,
    `unit_name` VARCHAR(50) NULL,
    `gstper` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `last_purchase_rate` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `qty` INTEGER NULL DEFAULT 0,
    `shop_id` INTEGER NULL DEFAULT 0,
    `insert_date` DATE NULL,
    `insert_user` VARCHAR(100) NULL,

    INDEX `barcode`(`barcode`),
    UNIQUE INDEX `barcode_shop`(`barcode`, `shop_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ha4_giftcard_issue_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_id` INTEGER NULL DEFAULT 0,
    `customer_id` INTEGER NULL,
    `card_id` INTEGER NULL DEFAULT 0,
    `card_number` VARCHAR(100) NULL,
    `cardtype` INTEGER NULL,
    `amount` FLOAT NULL DEFAULT 0,
    `expdays` INTEGER NULL,
    `startdate` DATE NULL,
    `is_use` ENUM('1', '0') NOT NULL DEFAULT '0',
    `use_date` DATE NULL,
    `use_customer_id` INTEGER NULL DEFAULT 0,
    `entry_date` DATE NULL,
    `entry_time` VARCHAR(100) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mukta_admin_db` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_fname` VARCHAR(50) NULL,
    `admin_lname` VARCHAR(50) NULL,
    `mob_one` VARCHAR(20) NULL,
    `mob_two` VARCHAR(20) NULL,
    `email_id` VARCHAR(100) NULL,
    `pinno` VARCHAR(20) NULL,
    `country_name` VARCHAR(100) NULL,
    `state_name` VARCHAR(100) NULL,
    `address` TEXT NULL,
    `admin_username` VARCHAR(30) NOT NULL,
    `admin_password` VARCHAR(30) NOT NULL,
    `pass_criteria` VARCHAR(100) NULL,
    `profile_img` TEXT NULL,
    `admin_type` VARCHAR(20) NOT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(50) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(50) NULL,

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mukta_autono_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `prefix` VARCHAR(100) NULL DEFAULT 'MJL',
    `autono_entry` INTEGER NULL DEFAULT 1,
    `autono_entry_return` INTEGER NULL DEFAULT 1,
    `incno_autono_entry_return` INTEGER NULL DEFAULT 10000,
    `autono_sale` INTEGER NULL DEFAULT 1,
    `inno_sales` INTEGER NULL DEFAULT 5000,
    `autno_taxinv` INTEGER NULL,
    `taxinv_inc` INTEGER NULL DEFAULT 5000,
    `autono_stockinword` INTEGER NULL,
    `sales_cadit` INTEGER NULL,
    `autono_sale_return` INTEGER NULL DEFAULT 1,
    `autono_receive` INTEGER NULL DEFAULT 1,
    `autono_payment` INTEGER NULL DEFAULT 1,
    `autono_expense` INTEGER NULL DEFAULT 1,
    `autono_design` INTEGER NULL,
    `autono_transfer` INTEGER NULL,
    `autono_inc_transfer` INTEGER NULL DEFAULT 15000,
    `autono_wh_transfer` INTEGER NOT NULL DEFAULT 1,
    `autono_wh_inc` INTEGER NOT NULL DEFAULT 1,
    `barcode_autono` DOUBLE NULL DEFAULT 0,
    `autono_shop_transfert` INTEGER NULL,
    `invoice_shop_transfert` INTEGER NULL,
    `partycode` VARCHAR(10) NULL,
    `custcode` VARCHAR(10) NULL,
    `shopcode` INTEGER NULL DEFAULT 1,
    `brandcode` VARCHAR(10) NULL,
    `purches_inv` INTEGER NULL,
    `material_iss_autono` INTEGER NULL DEFAULT 1,
    `value_addtion_autono` INTEGER NULL DEFAULT 1,
    `shop_incno` INTEGER NULL DEFAULT 0,
    `draft_shop_incno` INTEGER NOT NULL DEFAULT 1,
    `dm_shop_incno` INTEGER NOT NULL DEFAULT 1,
    `draft_order_autono` INTEGER NOT NULL DEFAULT 1,
    `dm_order_autono` INTEGER NOT NULL DEFAULT 1,
    `shop_incno_return` INTEGER NULL DEFAULT 0,
    `shop_del_no` INTEGER NULL DEFAULT 1000,
    `giftcard` INTEGER NULL,
    `dell_gross_return` INTEGER NULL DEFAULT 100,
    `tax_gross_return` INTEGER NULL DEFAULT 100,
    `recon_stock` INTEGER NULL DEFAULT 1000,
    `banktxnid` INTEGER NULL DEFAULT 1000000000,
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mukta_state_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country_id` INTEGER NULL,
    `state_name` VARCHAR(120) NULL,
    `state_code` VARCHAR(50) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mukta_user_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commonid` INTEGER NULL,
    `agentid` INTEGER NULL,
    `user_fname` VARCHAR(140) NULL,
    `user_lname` VARCHAR(140) NULL,
    `user_mobile` VARCHAR(140) NULL,
    `user_email` VARCHAR(140) NULL,
    `address` TEXT NULL,
    `pinno` VARCHAR(50) NULL,
    `age` INTEGER NULL,
    `user_photo` TEXT NULL,
    `user_biodata` TEXT NULL,
    `user_logid` VARCHAR(140) NULL,
    `user_pass` VARCHAR(140) NULL,
    `pass_criteria` VARCHAR(140) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `remarks` TEXT NULL,
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_item_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL DEFAULT 1,
    `warehouse_id` INTEGER NULL DEFAULT 1,
    `item_name` VARCHAR(350) NULL,
    `item_code` VARCHAR(20) NULL,
    `purch_type` VARCHAR(80) NULL,
    `gstper` FLOAT NULL,
    `alias` VARCHAR(80) NULL,
    `cod_print_tag` ENUM('1', '0') NOT NULL DEFAULT '1',
    `short_name` TEXT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `indate` DATE NOT NULL,
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `item_name`, `item_code`),
    INDEX `idx_com_warehouse`(`com_id`, `warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `u1_shop_user_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commonid` INTEGER NULL,
    `shop_id` INTEGER NULL,
    `user_fname` VARCHAR(140) NULL,
    `user_lname` VARCHAR(140) NULL,
    `user_mobile` VARCHAR(140) NULL,
    `user_email` VARCHAR(140) NULL,
    `address` TEXT NULL,
    `pinno` VARCHAR(50) NULL,
    `age` INTEGER NULL,
    `user_photo` TEXT NULL,
    `user_biodata` TEXT NULL,
    `user_logid` VARCHAR(140) NULL,
    `user_pass` VARCHAR(140) NULL,
    `pass_criteria` VARCHAR(140) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `remarks` TEXT NULL,
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `u2_shop_interface_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `interface_name` VARCHAR(140) NULL,
    `sub_interface` VARCHAR(140) NOT NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(140) NULL,
    `insert_time` VARCHAR(140) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `u3_shop_user_permission_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `interface_id` INTEGER NULL,
    `insert_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `edit_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `delete_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `view_status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(140) NULL,
    `insert_time` VARCHAR(140) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x10_app_order_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(50) NOT NULL,
    `order_detail_id` INTEGER NULL,
    `com_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `order_status` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x11_app_payment_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(50) NULL,
    `payment_mode` VARCHAR(50) NULL,
    `payment_details` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x12_app_user_bm_coins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `total_coins` INTEGER NULL,
    `used_coins` INTEGER NULL,
    `net_bm_coins` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x5_app_cart` (
    `cart_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `com_id` INTEGER NOT NULL,
    `qnty` INTEGER NOT NULL DEFAULT 1,
    `isdelete` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    UNIQUE INDEX `x5_app_cart_com_id_product_id_key`(`com_id`, `product_id`),
    PRIMARY KEY (`cart_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x7_app_users_coupon_code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `coupon_id` INTEGER NULL,
    `status` ENUM('0', '1') NULL DEFAULT '0',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x8_app_orders_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(50) NOT NULL,
    `com_id` INTEGER NULL,
    `total_amount` DECIMAL(10, 2) NULL,
    `discounted_amount` DECIMAL(10, 2) NULL,
    `del_charge_amount` DECIMAL(10, 2) NULL,
    `tax_amount_b_coins` DECIMAL(10, 2) NULL,
    `net_amount_payment_mode` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    UNIQUE INDEX `x8_app_orders_master_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x9_app_order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(50) NOT NULL,
    `com_id` INTEGER NOT NULL,
    `product_id` INTEGER NULL,
    `qnty` INTEGER NOT NULL,
    `rate` DECIMAL(10, 2) NULL,
    `gst_rate` DECIMAL(10, 2) NULL,
    `gst_percent` DECIMAL(5, 2) NULL,
    `coupon_price` DECIMAL(10, 2) NULL,
    `net_amount` DECIMAL(10, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z1_excel_import_purchase_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NOT NULL,
    `groc_entry` INTEGER NULL DEFAULT 0,
    `orderid` VARCHAR(20) NULL,
    `invoiceid` VARCHAR(20) NULL,
    `inv_type` INTEGER NULL DEFAULT 0,
    `grntype` VARCHAR(10) NULL,
    `grndate` DATE NULL,
    `party_id` VARCHAR(10) NULL,
    `invno` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `lrno` VARCHAR(50) NULL,
    `lrdate` DATE NULL,
    `transporter_id` VARCHAR(50) NULL,
    `mode_transport` VARCHAR(50) NULL,
    `tot_qty` FLOAT NULL,
    `tot_amt` FLOAT NULL,
    `pack_charge` FLOAT NULL DEFAULT 0,
    `disper` FLOAT NULL,
    `disamt` FLOAT NULL,
    `tax_amount` FLOAT NULL DEFAULT 0,
    `other_charge` FLOAT NULL DEFAULT 0,
    `lessper` FLOAT NULL,
    `lessamt` FLOAT NULL,
    `freight` FLOAT NULL,
    `round_off` FLOAT NULL,
    `taxvalue` FLOAT NULL,
    `gst_per` FLOAT NULL,
    `gst_amt` FLOAT NULL,
    `grand_tot` FLOAT NULL,
    `payment_amt` FLOAT NULL DEFAULT 0,
    `payment_billno` INTEGER NULL,
    `bankdt` INTEGER NULL,
    `desc_text` TEXT NULL,
    `roundof_type` INTEGER NULL DEFAULT 1,
    `jsan_data` TEXT NULL,
    `entry_date` DATE NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,
    `entydatetime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z2_excel_import_purchase_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `invtype` INTEGER NULL,
    `itemid` INTEGER NULL,
    `brand_id` INTEGER NULL,
    `edition` VARCHAR(100) NULL,
    `design_id` INTEGER NULL,
    `barcode` VARCHAR(30) NULL,
    `color_id` INTEGER NULL,
    `fabric_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `unit_id` INTEGER NULL,
    `meter` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `free_qty` VARCHAR(50) NULL,
    `rate` DOUBLE NULL,
    `rd_amt` FLOAT NULL,
    `disc_per` FLOAT NULL,
    `disc_amt` FLOAT NULL DEFAULT 0,
    `sp_dis` FLOAT NULL,
    `totalamt` FLOAT NULL,
    `gstper` FLOAT NULL,
    `gstamt` FLOAT NOT NULL DEFAULT 0,
    `purchase_amt` FLOAT NULL DEFAULT 0,
    `with_faction` INTEGER NULL DEFAULT 0,
    `mrp_price` DOUBLE NULL,
    `sale_price` DOUBLE NULL,
    `online_price` DOUBLE NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z3_barcode_field_settings_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dmt_reason` VARCHAR(80) NULL,
    `brand_status` ENUM('1', '0') NOT NULL DEFAULT '0',
    `edition_status` ENUM('1', '0') NOT NULL DEFAULT '0',
    `design_status` ENUM('1', '0') NULL DEFAULT '0',
    `size_status` ENUM('1', '0') NULL DEFAULT '0',
    `color_status` ENUM('1', '0') NULL DEFAULT '0',
    `material_status` ENUM('1', '0') NULL DEFAULT '0',
    `category_status` ENUM('1', '0') NULL DEFAULT '0',
    `unit_status` ENUM('1', '0') NULL DEFAULT '0',
    `insert_date` VARCHAR(50) NULL,
    `insert_user` VARCHAR(150) NULL,
    `update_date` VARCHAR(50) NULL,
    `update_user` VARCHAR(150) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z4_draft_markdown_shop_invoice_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryid` VARCHAR(50) NULL,
    `comid` INTEGER NULL,
    `serialno` INTEGER NULL DEFAULT 0,
    `incno` INTEGER NOT NULL,
    `invoice_no` VARCHAR(100) NULL,
    `test_inv_no` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `inv_time` VARCHAR(50) NULL,
    `invtype` INTEGER NULL DEFAULT 1,
    `partyid` INTEGER NULL,
    `gsttype` ENUM('1', '0') NOT NULL DEFAULT '1',
    `totqty` DOUBLE NULL,
    `tottaxamt` DOUBLE NULL,
    `totamt` DOUBLE NULL,
    `delcharge` DOUBLE NULL,
    `invoice_amt` DOUBLE NULL,
    `billby` INTEGER NULL,
    `salesman` INTEGER NULL,
    `remarks` VARCHAR(200) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `serialno`, `incno`, `invoice_no`, `invtype`, `partyid`),
    INDEX `id_2`(`id`, `comid`, `incno`, `partyid`, `invtype`),
    INDEX `partyid`(`partyid`),
    PRIMARY KEY (`incno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z5_draft_markdown_shop_invoice_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `invdate` DATE NULL,
    `barcodeid` INTEGER NULL DEFAULT 0,
    `barcode` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `return_qty` FLOAT NULL DEFAULT 0,
    `exsit_return_qty` FLOAT NULL DEFAULT 0,
    `rate` FLOAT NULL,
    `disper` FLOAT NULL,
    `taxamt` FLOAT NULL,
    `gstper` FLOAT NULL,
    `comment` VARCHAR(100) NULL,
    `is_free` INTEGER NULL DEFAULT 0,
    `ismarkdown` ENUM('1', '0') NOT NULL DEFAULT '0',
    `markdownamt` FLOAT NULL DEFAULT 0,
    `totalamt` FLOAT NULL,
    `appstatus` ENUM('0', '1') NOT NULL DEFAULT '0',
    `sales_bill_status` ENUM('0', '1') NOT NULL DEFAULT '0',
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `incno`, `barcode`),
    INDEX `incno`(`incno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z6_dismaintain_shop_invoice_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryid` VARCHAR(50) NULL,
    `comid` INTEGER NULL,
    `incno` INTEGER NOT NULL,
    `invoice_no` VARCHAR(100) NULL,
    `test_inv_no` VARCHAR(50) NULL,
    `invdate` DATE NULL,
    `inv_time` VARCHAR(50) NULL,
    `totqty` DOUBLE NULL,
    `totamt` DOUBLE NULL,
    `delcharge` DOUBLE NULL,
    `invoice_amt` DOUBLE NULL,
    `billby` INTEGER NULL,
    `remarks` VARCHAR(200) NULL,
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `incno`, `invoice_no`),
    INDEX `id_2`(`id`, `comid`, `incno`),
    PRIMARY KEY (`incno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z7_dismaintain_shop_invoice_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comid` INTEGER NULL,
    `incno` INTEGER NULL,
    `invdate` DATE NULL,
    `barcodeid` INTEGER NULL DEFAULT 0,
    `barcode` VARCHAR(50) NULL,
    `unit` VARCHAR(50) NULL,
    `qty` FLOAT NULL,
    `rate` FLOAT NULL,
    `comment` VARCHAR(100) NULL,
    `totalamt` FLOAT NULL,
    `dm_status_admin` ENUM('0', '1') NOT NULL DEFAULT '0',
    `dm_status_shop` ENUM('0', '1') NOT NULL DEFAULT '0',
    `status` ENUM('1', '0') NOT NULL DEFAULT '1',
    `insert_date` VARCHAR(40) NULL,
    `insert_user` VARCHAR(120) NULL,
    `update_date` VARCHAR(40) NULL,
    `update_user` VARCHAR(120) NULL,

    INDEX `id`(`id`, `comid`, `incno`, `barcode`),
    INDEX `incno`(`incno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `id` ON `aa4_category_db`(`id`, `cat_name`);

-- CreateIndex
CREATE INDEX `index_category_db` ON `aa4_category_db`(`id`, `cat_name`, `cat_code`);

-- CreateIndex
CREATE INDEX `bar_code` ON `caa1_shop_stock_item_db`(`bar_code`);

-- CreateIndex
CREATE INDEX `id` ON `caa1_shop_stock_item_db`(`id`, `bar_code`, `shop_id`, `praty_id`, `item_id`, `brand_id`, `design_id`, `color_id`, `fabric_id`, `cat_id`, `unit_id`);

-- CreateIndex
CREATE INDEX `index2` ON `caa1_shop_stock_item_db`(`id`, `bar_code`, `shop_id`);

-- CreateIndex
CREATE INDEX `praty_id` ON `caa1_shop_stock_item_db`(`praty_id`);

-- CreateIndex
CREATE INDEX `id` ON `cb1_customer_db`(`id`, `full_name`, `contact_no`);

-- CreateIndex
CREATE UNIQUE INDEX `product_id` ON `x1_app_product_register`(`product_id`);

-- AddForeignKey
ALTER TABLE `x2_app_product_img_register` ADD CONSTRAINT `x2_app_product_img_register_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `x1_app_product_register`(`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x3_app_product_ratings` ADD CONSTRAINT `x3_app_product_ratings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `aa13_customer_db`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x4_app_user_addresses` ADD CONSTRAINT `x4_app_user_addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `aa13_customer_db`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caa1_shop_stock_item_db` ADD CONSTRAINT `caa1_shop_stock_item_db_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `x1_app_product_register`(`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x10_app_order_status` ADD CONSTRAINT `x10_app_order_status_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `x8_app_orders_master`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x10_app_order_status` ADD CONSTRAINT `x10_app_order_status_order_detail_id_fkey` FOREIGN KEY (`order_detail_id`) REFERENCES `x9_app_order_details`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x5_app_cart` ADD CONSTRAINT `x5_app_cart_com_id_fkey` FOREIGN KEY (`com_id`) REFERENCES `aa13_customer_db`(`com_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x5_app_cart` ADD CONSTRAINT `x5_app_cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `x1_app_product_register`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x8_app_orders_master` ADD CONSTRAINT `x8_app_orders_master_com_id_fkey` FOREIGN KEY (`com_id`) REFERENCES `aa13_customer_db`(`com_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x9_app_order_details` ADD CONSTRAINT `x9_app_order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `x8_app_orders_master`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
