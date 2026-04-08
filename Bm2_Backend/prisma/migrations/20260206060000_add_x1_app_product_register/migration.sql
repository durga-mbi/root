-- CreateTable
CREATE TABLE `x1_app_product_register` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `product_name` VARCHAR(255) NULL,
    `new_protype` VARCHAR(100) NULL,
    `display_section` VARCHAR(100) NULL,
    `shdesc` TEXT NULL,
    `lgdesc` LONGTEXT NULL,
    `key_features` LONGTEXT NULL,
    `cancel_returns` TEXT NULL,
    `overview` LONGTEXT NULL,
    `proimg` VARCHAR(255) NULL,
    `is_display` VARCHAR(1) NULL,
    `delivery_days` INTEGER NULL,
    `ratings` DECIMAL(2, 1) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `x1_app_product_register_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
