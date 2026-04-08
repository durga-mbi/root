-- CreateTable
CREATE TABLE `product_register` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `product_name` VARCHAR(255) NULL,
    `new_protype` VARCHAR(100) NULL,
    `display_section` VARCHAR(100) NULL,
    `shdesc` TEXT NULL,
    `lgdesc` TEXT NULL,
    `key_features` TEXT NULL,
    `cancel_returns` TEXT NULL,
    `overview` TEXT NULL,
    `proimg` VARCHAR(255) NULL,
    `is_display` ENUM('ZERO', 'ONE') NOT NULL DEFAULT 'ONE',
    `delivery_days` INTEGER NULL,
    `ratings` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_register_product_id_key`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
