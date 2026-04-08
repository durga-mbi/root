-- CreateTable
CREATE TABLE `product_image_register` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `proimgs` VARCHAR(255) NULL,
    `status` VARCHAR(1) NULL DEFAULT '1',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `product_image_register_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_image_register` ADD CONSTRAINT `product_image_register_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product_register`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
