-- AlterTable
ALTER TABLE `config_table` ADD COLUMN `deliveryCharge` DECIMAL(18, 3) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `order_address` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'Home',
    MODIFY `country` VARCHAR(191) NOT NULL DEFAULT 'India';

-- AlterTable
ALTER TABLE `user_addresses` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'Home';

-- CreateTable
CREATE TABLE `order_status_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PACKAGING', 'SHIPPING', 'READY_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL,
    `message` TEXT NOT NULL,
    `createdBy` VARCHAR(191) NULL DEFAULT 'System',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_status_logs_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_status_logs` ADD CONSTRAINT `order_status_logs_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order_place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
