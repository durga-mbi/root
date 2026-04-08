-- CreateTable
CREATE TABLE `x4_app_user_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `address` TEXT NULL,
    `town_city` VARCHAR(100) NULL,
    `pincode` VARCHAR(10) NULL,
    `receivers_name` VARCHAR(150) NULL,
    `receivers_number` VARCHAR(15) NULL,
    `save_as` VARCHAR(50) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME(3) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    INDEX `x4_app_user_addresses_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `x4_app_user_addresses` ADD CONSTRAINT `x4_app_user_addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
