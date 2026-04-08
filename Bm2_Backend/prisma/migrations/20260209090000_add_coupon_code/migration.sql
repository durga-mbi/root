-- CreateTable
CREATE TABLE `x6_app_coupon_code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `terms_conditions` TEXT NULL,
    `valid_category` VARCHAR(100) NULL,
    `valid_brand` VARCHAR(100) NULL,
    `valid_edition` VARCHAR(100) NULL,
    `valid_item` VARCHAR(100) NULL,
    `valid_price` DECIMAL(10, 2) NULL,
    `valid_date` DATE NULL,
    `issued_qnty` INTEGER NULL,
    `received_qnty` INTEGER NULL,
    `user_qnty` INTEGER NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
