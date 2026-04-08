-- CreateTable
CREATE TABLE `aa_0_admin_db` (
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
    `admin_password` VARCHAR(255) NOT NULL,
    `profile_img` TEXT NULL,
    `admin_type` ENUM('SUPERADMIN', 'ADMIN', 'MANAGER') NOT NULL,
    `access_token` TEXT NULL,
    `refresh_token` TEXT NULL,
    `status` VARCHAR(1) NOT NULL DEFAULT '1',
    `insert_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `insert_user` VARCHAR(50) NULL,
    `update_date` DATETIME(3) NOT NULL,
    `update_user` VARCHAR(50) NULL,

    UNIQUE INDEX `aa_0_admin_db_email_id_key`(`email_id`),
    UNIQUE INDEX `aa_0_admin_db_admin_username_key`(`admin_username`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NULL,
    `email` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(20) NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `admin_id` INTEGER NOT NULL,
    `status` VARCHAR(1) NOT NULL DEFAULT '1',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(50) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(50) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `admin_id` INTEGER NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `details` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_login_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `loginTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logout_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aa4_category_db` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `com_id` INTEGER NULL,
    `cat_name` VARCHAR(100) NOT NULL,
    `cat_code` VARCHAR(50) NULL,
    `cat_desc` TEXT NULL,
    `cat_image` TEXT NULL,
    `disorder` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 1,
    `insert_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `insert_user` VARCHAR(50) NULL,
    `update_date` DATETIME(3) NULL,
    `update_user` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activity_logs` ADD CONSTRAINT `user_activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activity_logs` ADD CONSTRAINT `user_activity_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_login_history` ADD CONSTRAINT `admin_login_history_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
