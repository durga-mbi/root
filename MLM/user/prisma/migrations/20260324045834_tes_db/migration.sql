-- CreateTable
CREATE TABLE `aa_0_admin_db` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_fname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `admin_lname` VARCHAR(191) NULL,
    `admin_username` VARCHAR(191) NULL,
    `admin_password` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `admin_type` ENUM('SUPERADMIN', 'ADMIN', 'MANAGER') NOT NULL DEFAULT 'SUPERADMIN',
    `refresh_token` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT '1',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `aa_0_admin_db_email_key`(`email`),
    UNIQUE INDEX `aa_0_admin_db_mobile_key`(`mobile`),
    UNIQUE INDEX `aa_0_admin_db_admin_username_key`(`admin_username`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_login_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `loginTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logoutTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uId` INTEGER NULL,
    `memberId` VARCHAR(191) NULL,
    `parentId` INTEGER NULL,
    `sponsorId` INTEGER NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `legPosition` ENUM('LEFT', 'RIGHT') NULL,
    `leftChildId` INTEGER NULL,
    `rightChildId` INTEGER NULL,
    `lastLeftId` INTEGER NULL,
    `lastRightId` INTEGER NULL,
    `lineagePath` VARCHAR(191) NOT NULL,
    `directCount` INTEGER NOT NULL DEFAULT 0,
    `kycStatus` ENUM('PENDING', 'APPROVED', 'REJECT') NOT NULL DEFAULT 'PENDING',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `refresh_token` VARCHAR(191) NULL,
    `createdByAdminId` INTEGER NULL,
    `updatedByAdminId` INTEGER NULL,

    UNIQUE INDEX `users_uId_key`(`uId`),
    UNIQUE INDEX `users_memberId_key`(`memberId`),
    UNIQUE INDEX `users_mobile_key`(`mobile`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_lineagePath_idx`(`lineagePath`),
    INDEX `users_uId_idx`(`uId`),
    INDEX `users_sponsorId_idx`(`sponsorId`),
    INDEX `users_parentId_idx`(`parentId`),
    INDEX `users_memberId_idx`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `action` VARCHAR(191) NULL,
    `details` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_activity_logs_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kyc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `aadharNo` VARCHAR(191) NOT NULL,
    `aadharImgUrl` VARCHAR(191) NOT NULL,
    `panNo` VARCHAR(191) NOT NULL,
    `panImageUrl` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `accountNo` VARCHAR(191) NOT NULL,
    `ifscCode` VARCHAR(191) NOT NULL,
    `branchName` VARCHAR(191) NOT NULL,
    `bankProofImgUrl` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECT') NOT NULL DEFAULT 'PENDING',
    `rejectReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdByAdminId` INTEGER NULL,
    `updatedByAdminId` INTEGER NULL,
    `approvedByAdminId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plans_master` (
    `id` VARCHAR(191) NOT NULL,
    `planName` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `BV` DECIMAL(18, 3) NOT NULL,
    `price` DECIMAL(18, 3) NOT NULL,
    `dp_amount` DECIMAL(18, 3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `features` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdByAdminId` INTEGER NULL,
    `updatedByAdminId` INTEGER NULL,

    UNIQUE INDEX `plans_master_planName_key`(`planName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_purchases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `BV` DECIMAL(18, 3) NOT NULL,
    `dp_amount` DECIMAL(18, 3) NOT NULL,
    `plan_amount` DECIMAL(18, 3) NOT NULL,
    `payment_mode` VARCHAR(191) NULL,
    `payment_proof_uri` VARCHAR(191) NULL,
    `purchase_type` ENUM('FIRST_PURCHASE', 'REPURCHASE', 'SHARE_PURCHASE') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `approve_status` ENUM('0', '1') NOT NULL DEFAULT '0',
    `approved_by` INTEGER NULL,
    `approved_at` DATETIME(3) NULL,
    `is_income_generated` ENUM('0', '1') NOT NULL DEFAULT '0',
    `is_transferable` BOOLEAN NOT NULL DEFAULT false,
    `share_status` ENUM('NOT_APPLICABLE', 'AVAILABLE', 'RESERVED', 'TRANSFERRED', 'EXPIRED') NOT NULL DEFAULT 'NOT_APPLICABLE',
    `transferred_to_user_id` INTEGER NULL,
    `transferred_at` DATETIME(3) NULL,
    `parent_purchase_id` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `plan_purchases_transferred_to_user_id_key`(`transferred_to_user_id`),
    INDEX `plan_purchases_user_id_purchase_type_idx`(`user_id`, `purchase_type`),
    INDEX `plan_purchases_user_id_share_status_idx`(`user_id`, `share_status`),
    INDEX `plan_purchases_parent_purchase_id_idx`(`parent_purchase_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_table` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `autoMemId` ENUM('0', '1') NOT NULL DEFAULT '0',
    `userRegistrationNo` INTEGER NOT NULL DEFAULT 0,
    `prefixMemId` VARCHAR(191) NOT NULL,
    `minLength` INTEGER NOT NULL,
    `plan_config_key` VARCHAR(191) NOT NULL,
    `plan_config_value` ENUM('0', '1') NOT NULL DEFAULT '0',
    `incomeCommission` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `royaltyCommission` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `tds` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `admincharges` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `config_table_plan_config_key_key`(`plan_config_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bv_ledger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_id` INTEGER NOT NULL,
    `buyer_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `bv` DECIMAL(18, 3) NOT NULL,
    `purchase_type` ENUM('FIRST_PURCHASE', 'REPURCHASE', 'SHARE_PURCHASE') NOT NULL,
    `buyer_leg` ENUM('LEFT', 'RIGHT') NULL,
    `is_income_generated` ENUM('0', '1') NOT NULL DEFAULT '0',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `bv_ledger_user_id_idx`(`user_id`),
    INDEX `bv_ledger_buyer_id_idx`(`buyer_id`),
    INDEX `bv_ledger_purchase_id_idx`(`purchase_id`),
    INDEX `bv_ledger_purchase_type_idx`(`purchase_type`),
    UNIQUE INDEX `bv_ledger_purchase_id_user_id_key`(`purchase_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_tree_closure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sponsorId` INTEGER NOT NULL,
    `parentId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `legPosition` ENUM('LEFT', 'RIGHT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_tree_closure_sponsorId_idx`(`sponsorId`),
    INDEX `user_tree_closure_parentId_idx`(`parentId`),
    INDEX `user_tree_closure_memberId_idx`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `royal_qualifier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    INDEX `royal_qualifier_userId_idx`(`userId`),
    INDEX `royal_qualifier_childId_idx`(`childId`),
    UNIQUE INDEX `royal_qualifier_userId_childId_key`(`userId`, `childId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_income` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `matched_bv` INTEGER NOT NULL,
    `income` DECIMAL(18, 3) NOT NULL,
    `message_data` VARCHAR(191) NULL,
    `generateIncomeId` INTEGER NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    INDEX `system_income_createdAt_idx`(`createdAt`),
    INDEX `system_income_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `total_income` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `total_withdraw` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `total_dp_amount` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `balance_dp_amount` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `super_coins` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `used_super_coins` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `matched_bv` INTEGER NOT NULL DEFAULT 0,
    `total_left_bv` INTEGER NOT NULL DEFAULT 0,
    `total_right_bv` INTEGER NOT NULL DEFAULT 0,
    `left_carryforward_bv` INTEGER NOT NULL DEFAULT 0,
    `right_carryforward_bv` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    UNIQUE INDEX `wallet_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('INCOME', 'WITHDRAW', 'PURCHASE', 'ADJUSTMENT') NOT NULL,
    `amount` DECIMAL(18, 3) NOT NULL,
    `reference_id` INTEGER NULL,
    `message` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    INDEX `wallet_transaction_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `royal_club_income` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `generateIncomeId` INTEGER NULL,
    `income` DECIMAL(18, 3) NOT NULL,
    `message_data` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payoutDate` DATETIME(3) NOT NULL,
    `payoutCycle` VARCHAR(191) NOT NULL,
    `totalAmount` DECIMAL(18, 3) NOT NULL,
    `tds` DECIMAL(18, 3) NOT NULL,
    `adminCharges` DECIMAL(18, 3) NOT NULL,
    `netAmount` DECIMAL(18, 3) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_payout_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `payoutId` INTEGER NOT NULL,
    `totalAmount` DECIMAL(18, 3) NOT NULL,
    `tdsAmount` DECIMAL(18, 3) NOT NULL,
    `adminCharges` DECIMAL(18, 3) NOT NULL,
    `netAmount` DECIMAL(18, 3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generate_income` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalIncome` DECIMAL(18, 3) NOT NULL,
    `netincome` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `tds` DECIMAL(18, 3) NOT NULL,
    `adminCharges` DECIMAL(18, 3) NOT NULL,
    `generatedDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `income_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `incomeId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `totalIncome` DECIMAL(18, 3) NOT NULL,
    `tds` DECIMAL(18, 3) NOT NULL,
    `adminCharges` DECIMAL(18, 3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchedBV` INTEGER NOT NULL,
    `giftName` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `reward_config_matchedBV_key`(`matchedBV`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `rewardId` INTEGER NOT NULL,
    `matchedBV` INTEGER NOT NULL,
    `giftName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reward_history_userId_rewardId_key`(`userId`, `rewardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subcategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subcategoryId` INTEGER NOT NULL,
    `brandname` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `categoriesId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productName` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `subcategoryId` INTEGER NOT NULL,
    `brandId` INTEGER NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `HSNcode` VARCHAR(191) NOT NULL,
    `dp_amount` INTEGER NOT NULL,
    `mrp_amount` INTEGER NOT NULL,
    `tax` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `specifaction` VARCHAR(191) NOT NULL,
    `productmainimage` VARCHAR(191) NOT NULL,
    `productOtherimage` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_sku_key`(`sku`),
    INDEX `product_categoryId_idx`(`categoryId`),
    INDEX `product_subcategoryId_idx`(`subcategoryId`),
    INDEX `product_brandId_idx`(`brandId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sku_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sku_config_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(191) NOT NULL,
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,
    `paymentMethod` ENUM('COD', 'ONLINE', 'WALLET', 'DP_WALLET') NOT NULL,
    `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `orderStatus` ENUM('PENDING', 'CONFIRMED', 'PACKAGING', 'SHIPPING', 'READY_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `subtotal` DECIMAL(18, 3) NOT NULL,
    `shippingAmount` DECIMAL(18, 3) NOT NULL,
    `gstAmount` DECIMAL(18, 3) NOT NULL,
    `coinsApplied` DECIMAL(18, 3) NOT NULL,
    `totalPurchaseAmount` DECIMAL(18, 3) NOT NULL,
    `totalDpAmount` DECIMAL(18, 3) NOT NULL,
    `totalTax` DECIMAL(18, 3) NOT NULL,
    `totalBv` INTEGER NOT NULL,
    `deliveredAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `order_place_orderNumber_key`(`orderNumber`),
    INDEX `order_place_customerId_idx`(`customerId`),
    INDEX `order_place_customerId_orderDate_idx`(`customerId`, `orderDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `price` DECIMAL(18, 3) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `bv` INTEGER NOT NULL,
    `totalPrice` DECIMAL(18, 3) NOT NULL,

    INDEX `order_details_orderId_idx`(`orderId`),
    INDEX `order_details_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `addressLine` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `order_address_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `addressLine` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `carts_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `comment` TEXT NULL,
    `images` TEXT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ConfigRoyalPlans` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ConfigRoyalPlans_AB_unique`(`A`, `B`),
    INDEX `_ConfigRoyalPlans_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_login_history` ADD CONSTRAINT `admin_login_history_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_sponsorId_fkey` FOREIGN KEY (`sponsorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_leftChildId_fkey` FOREIGN KEY (`leftChildId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_rightChildId_fkey` FOREIGN KEY (`rightChildId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_lastLeftId_fkey` FOREIGN KEY (`lastLeftId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_lastRightId_fkey` FOREIGN KEY (`lastRightId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activity_logs` ADD CONSTRAINT `user_activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc` ADD CONSTRAINT `kyc_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc` ADD CONSTRAINT `kyc_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc` ADD CONSTRAINT `kyc_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc` ADD CONSTRAINT `kyc_approvedByAdminId_fkey` FOREIGN KEY (`approvedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans_master` ADD CONSTRAINT `plans_master_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans_master` ADD CONSTRAINT `plans_master_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_parent_purchase_id_fkey` FOREIGN KEY (`parent_purchase_id`) REFERENCES `plan_purchases`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bv_ledger` ADD CONSTRAINT `bv_ledger_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `plan_purchases`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bv_ledger` ADD CONSTRAINT `bv_ledger_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bv_ledger` ADD CONSTRAINT `bv_ledger_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tree_closure` ADD CONSTRAINT `user_tree_closure_sponsorId_fkey` FOREIGN KEY (`sponsorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tree_closure` ADD CONSTRAINT `user_tree_closure_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tree_closure` ADD CONSTRAINT `user_tree_closure_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `royal_qualifier` ADD CONSTRAINT `royal_qualifier_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `royal_qualifier` ADD CONSTRAINT `royal_qualifier_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_income` ADD CONSTRAINT `system_income_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_income` ADD CONSTRAINT `system_income_generateIncomeId_fkey` FOREIGN KEY (`generateIncomeId`) REFERENCES `generate_income`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet` ADD CONSTRAINT `wallet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet_transaction` ADD CONSTRAINT `wallet_transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `royal_club_income` ADD CONSTRAINT `royal_club_income_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `royal_club_income` ADD CONSTRAINT `royal_club_income_generateIncomeId_fkey` FOREIGN KEY (`generateIncomeId`) REFERENCES `generate_income`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_payout_history` ADD CONSTRAINT `users_payout_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_payout_history` ADD CONSTRAINT `users_payout_history_payoutId_fkey` FOREIGN KEY (`payoutId`) REFERENCES `payout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `income_history` ADD CONSTRAINT `income_history_incomeId_fkey` FOREIGN KEY (`incomeId`) REFERENCES `generate_income`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `income_history` ADD CONSTRAINT `income_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reward_history` ADD CONSTRAINT `reward_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reward_history` ADD CONSTRAINT `reward_history_rewardId_fkey` FOREIGN KEY (`rewardId`) REFERENCES `reward_config`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand` ADD CONSTRAINT `brand_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand` ADD CONSTRAINT `brand_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_place` ADD CONSTRAINT `order_place_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order_place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_address` ADD CONSTRAINT `order_address_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order_place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConfigRoyalPlans` ADD CONSTRAINT `_ConfigRoyalPlans_A_fkey` FOREIGN KEY (`A`) REFERENCES `config_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConfigRoyalPlans` ADD CONSTRAINT `_ConfigRoyalPlans_B_fkey` FOREIGN KEY (`B`) REFERENCES `plans_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
