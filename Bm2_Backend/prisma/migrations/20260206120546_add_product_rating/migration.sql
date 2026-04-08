-- CreateTable
CREATE TABLE `x3_app_product_ratings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `total_ratings` INTEGER NULL,
    `given_ratings` INTEGER NULL,
    `message` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME(3) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    INDEX `x3_app_product_ratings_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
