-- CreateTable
CREATE TABLE `x3_app_product_rating_images` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_rating_id` INTEGER NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `cloudinary_public_id` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `x3_app_product_rating_images_product_rating_id_idx` (`product_rating_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
