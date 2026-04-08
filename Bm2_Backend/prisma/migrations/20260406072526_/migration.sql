/*
  Warnings:

  - You are about to drop the column `praty_id` on the `caa1_shop_stock_item_db` table. All the data in the column will be lost.
  - You are about to drop the column `stoct_update_date` on the `caa1_shop_stock_item_db` table. All the data in the column will be lost.
  - You are about to alter the column `save_as` on the `x4_app_user_addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to drop the `aa11_design_register_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa12_gstper_register_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa14_employee_register_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa15_shop_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa16_emp_type_tbl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa17_tran_mode_tbl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa18_item_discount_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa1_brand_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa2_color_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa3_fabric_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa5_unit_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa6_size_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa7_transporter_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa8_party_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aa9_warehouse_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `b12_admin_log_history_tbl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ba1_stock_item_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ba2_purchase_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ba3_purchase_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ba4_purchase_excel_faild_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ba4_stock_transfer_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ba5_stock_transfer_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `backup_cc1_shop_invoice_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bb1_invoice_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bb2_invoice_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bb3_tax_invoice_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bb4_tax_invoice_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bd1_purchase_return_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bd2_purchase_return_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ca1_stock_tran_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ca2_stock_tran_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cable_interface_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cable_user_permission_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cb1_customer_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cb2_shop_employee_register_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cb3_shop_discount_register_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cc1_shop_invoice_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cc2_shop_invoice_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cd1_shop_invoice_return` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cd2_shop_invoice_return_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `da1_change_selling_price_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ea1_shop_stock_tran_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ea2_shop_stock_tran_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grocery_purchase_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grocery_purchase_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grocery_stock_item_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ha4_giftcard_issue_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mukta_admin_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mukta_autono_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mukta_state_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mukta_user_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_item_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `u1_shop_user_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `u2_shop_interface_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `u3_shop_user_permission_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `x3_app_product_rating_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z1_excel_import_purchase_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z2_excel_import_purchase_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z3_barcode_field_settings_db` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z4_draft_markdown_shop_invoice_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z5_draft_markdown_shop_invoice_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z6_dismaintain_shop_invoice_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z7_dismaintain_shop_invoice_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `id` ON `caa1_shop_stock_item_db`;

-- DropIndex
DROP INDEX `praty_id` ON `caa1_shop_stock_item_db`;

-- AlterTable
ALTER TABLE `aa13_customer_db` ADD COLUMN `coin_balance` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `pending_coin_balance` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `role` VARCHAR(20) NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE `aa4_category_db` MODIFY `add_to_website` ENUM('1', '0') NULL DEFAULT '0';

-- AlterTable
ALTER TABLE `caa1_shop_stock_item_db` DROP COLUMN `praty_id`,
    DROP COLUMN `stoct_update_date`,
    ADD COLUMN `party_id` INTEGER NULL,
    ADD COLUMN `stock_update_date` DATE NULL;

-- AlterTable
ALTER TABLE `x10_app_order_status` ADD COLUMN `cancel_at` DATETIME(3) NULL,
    ADD COLUMN `cancel_by` INTEGER NULL,
    ADD COLUMN `cancel_reason` TEXT NULL,
    ADD COLUMN `del_charge_amount` DECIMAL(10, 2) NULL,
    ADD COLUMN `discounted_amount` DECIMAL(10, 2) NULL,
    ADD COLUMN `net_amount_payment_mode` VARCHAR(50) NULL,
    ADD COLUMN `quantity` INTEGER NULL,
    ADD COLUMN `tax_amount_b_coins` DECIMAL(10, 2) NULL,
    ADD COLUMN `total_amount` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `x1_app_product_register` MODIFY `is_display` ENUM('1', '0') NULL DEFAULT '1';

-- AlterTable
ALTER TABLE `x2_app_product_img_register` MODIFY `status` ENUM('1', '0') NULL DEFAULT '1';

-- AlterTable
ALTER TABLE `x4_app_user_addresses` ADD COLUMN `is_default` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `state` VARCHAR(100) NULL,
    MODIFY `pincode` VARCHAR(20) NULL,
    MODIFY `receivers_number` VARCHAR(20) NULL,
    MODIFY `save_as` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `x6_app_coupon_code` ADD COLUMN `status` VARCHAR(20) NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `x7_app_users_coupon_code` MODIFY `status` ENUM('1', '0') NULL DEFAULT '0';

-- AlterTable
ALTER TABLE `x8_app_orders_master` ADD COLUMN `status` VARCHAR(50) NULL;

-- DropTable
DROP TABLE `aa11_design_register_db`;

-- DropTable
DROP TABLE `aa12_gstper_register_db`;

-- DropTable
DROP TABLE `aa14_employee_register_db`;

-- DropTable
DROP TABLE `aa15_shop_master`;

-- DropTable
DROP TABLE `aa16_emp_type_tbl`;

-- DropTable
DROP TABLE `aa17_tran_mode_tbl`;

-- DropTable
DROP TABLE `aa18_item_discount_master`;

-- DropTable
DROP TABLE `aa1_brand_db`;

-- DropTable
DROP TABLE `aa2_color_db`;

-- DropTable
DROP TABLE `aa3_fabric_db`;

-- DropTable
DROP TABLE `aa5_unit_db`;

-- DropTable
DROP TABLE `aa6_size_db`;

-- DropTable
DROP TABLE `aa7_transporter_db`;

-- DropTable
DROP TABLE `aa8_party_db`;

-- DropTable
DROP TABLE `aa9_warehouse_db`;

-- DropTable
DROP TABLE `b12_admin_log_history_tbl`;

-- DropTable
DROP TABLE `ba1_stock_item_db`;

-- DropTable
DROP TABLE `ba2_purchase_master`;

-- DropTable
DROP TABLE `ba3_purchase_details`;

-- DropTable
DROP TABLE `ba4_purchase_excel_faild_details`;

-- DropTable
DROP TABLE `ba4_stock_transfer_master`;

-- DropTable
DROP TABLE `ba5_stock_transfer_details`;

-- DropTable
DROP TABLE `backup_cc1_shop_invoice_master`;

-- DropTable
DROP TABLE `bb1_invoice_master`;

-- DropTable
DROP TABLE `bb2_invoice_details`;

-- DropTable
DROP TABLE `bb3_tax_invoice_master`;

-- DropTable
DROP TABLE `bb4_tax_invoice_details`;

-- DropTable
DROP TABLE `bd1_purchase_return_master`;

-- DropTable
DROP TABLE `bd2_purchase_return_details`;

-- DropTable
DROP TABLE `ca1_stock_tran_master`;

-- DropTable
DROP TABLE `ca2_stock_tran_details`;

-- DropTable
DROP TABLE `cable_interface_db`;

-- DropTable
DROP TABLE `cable_user_permission_db`;

-- DropTable
DROP TABLE `cb1_customer_db`;

-- DropTable
DROP TABLE `cb2_shop_employee_register_db`;

-- DropTable
DROP TABLE `cb3_shop_discount_register_db`;

-- DropTable
DROP TABLE `cc1_shop_invoice_master`;

-- DropTable
DROP TABLE `cc2_shop_invoice_details`;

-- DropTable
DROP TABLE `cd1_shop_invoice_return`;

-- DropTable
DROP TABLE `cd2_shop_invoice_return_details`;

-- DropTable
DROP TABLE `da1_change_selling_price_details`;

-- DropTable
DROP TABLE `ea1_shop_stock_tran_master`;

-- DropTable
DROP TABLE `ea2_shop_stock_tran_details`;

-- DropTable
DROP TABLE `grocery_purchase_details`;

-- DropTable
DROP TABLE `grocery_purchase_master`;

-- DropTable
DROP TABLE `grocery_stock_item_db`;

-- DropTable
DROP TABLE `ha4_giftcard_issue_db`;

-- DropTable
DROP TABLE `mukta_admin_db`;

-- DropTable
DROP TABLE `mukta_autono_db`;

-- DropTable
DROP TABLE `mukta_state_db`;

-- DropTable
DROP TABLE `mukta_user_db`;

-- DropTable
DROP TABLE `stock_item_db`;

-- DropTable
DROP TABLE `u1_shop_user_db`;

-- DropTable
DROP TABLE `u2_shop_interface_db`;

-- DropTable
DROP TABLE `u3_shop_user_permission_db`;

-- DropTable
DROP TABLE `x3_app_product_rating_images`;

-- DropTable
DROP TABLE `z1_excel_import_purchase_master`;

-- DropTable
DROP TABLE `z2_excel_import_purchase_details`;

-- DropTable
DROP TABLE `z3_barcode_field_settings_db`;

-- DropTable
DROP TABLE `z4_draft_markdown_shop_invoice_master`;

-- DropTable
DROP TABLE `z5_draft_markdown_shop_invoice_details`;

-- DropTable
DROP TABLE `z6_dismaintain_shop_invoice_master`;

-- DropTable
DROP TABLE `z7_dismaintain_shop_invoice_details`;

-- CreateTable
CREATE TABLE `x23_app_product_rating_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_rating_id` INTEGER NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `cloudinary_public_id` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `x3_app_product_rating_images_product_rating_id_fkey`(`product_rating_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x20_app_order_return` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(191) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `com_id` INTEGER NOT NULL,
    `return_reason` VARCHAR(191) NOT NULL,
    `pickup_date` DATETIME(3) NOT NULL,
    `refund_amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `x20_app_order_return_order_id_idx`(`order_id`),
    INDEX `x20_app_order_return_product_id_idx`(`product_id`),
    INDEX `x20_app_order_return_com_id_idx`(`com_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x13_app_coin_wallet_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `version_number` INTEGER NOT NULL DEFAULT 1,
    `min_eligible_amount` DOUBLE NOT NULL,
    `max_eligible_amount` DOUBLE NOT NULL,
    `reward_percent_min` DOUBLE NOT NULL,
    `reward_percent_max` DOUBLE NOT NULL,
    `max_coins_per_order` INTEGER NOT NULL,
    `redeem_percent_limit` DOUBLE NOT NULL,
    `return_period_days` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x14_app_coin_wallet_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `order_id` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `credit_date` DATETIME(3) NOT NULL,
    `processed_at` DATETIME(3) NULL,
    `config_snapshot` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `x14_app_coin_wallet_transactions_user_id_idx`(`user_id`),
    INDEX `x14_app_coin_wallet_transactions_status_credit_date_idx`(`status`, `credit_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x18_app_send_notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `x18_app_send_notifications_user_id_idx`(`user_id`),
    INDEX `x18_app_send_notifications_user_id_is_read_idx`(`user_id`, `is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x15_app_faq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `answer` LONGTEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'GENERAL',
    `priority` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    INDEX `x15_app_faq_category_idx`(`category`),
    INDEX `x15_app_faq_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x21_app_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(100) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `updated_by` INTEGER NULL,

    UNIQUE INDEX `x21_app_content_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x22_app_enquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `subject` VARCHAR(200) NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `x22_app_enquiry_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x19_app_device_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `platform` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `x19_app_device_tokens_token_key`(`token`),
    INDEX `x19_app_device_tokens_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `id` ON `caa1_shop_stock_item_db`(`id`, `bar_code`, `shop_id`, `party_id`, `item_id`, `brand_id`, `design_id`, `color_id`, `fabric_id`, `cat_id`, `unit_id`);

-- CreateIndex
CREATE INDEX `party_id` ON `caa1_shop_stock_item_db`(`party_id`);

-- CreateIndex
CREATE INDEX `x9_app_order_details_product_id_fkey` ON `x9_app_order_details`(`product_id`);

-- AddForeignKey
ALTER TABLE `x3_app_product_ratings` ADD CONSTRAINT `x3_app_product_ratings_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `x1_app_product_register`(`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x23_app_product_rating_images` ADD CONSTRAINT `x23_app_product_rating_images_product_rating_id_fkey` FOREIGN KEY (`product_rating_id`) REFERENCES `x3_app_product_ratings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x9_app_order_details` ADD CONSTRAINT `x9_app_order_details_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `x1_app_product_register`(`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x19_app_device_tokens` ADD CONSTRAINT `x19_app_device_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `aa13_customer_db`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `x4_app_user_addresses` RENAME INDEX `x4_app_user_addresses_user_id_idx` TO `x4_app_user_addresses_user_id_fkey`;
