-- CreateIndex
CREATE INDEX `generate_income_generatedDate_idx` ON `generate_income`(`generatedDate`);

-- CreateIndex
CREATE INDEX `generate_income_createdAt_idx` ON `generate_income`(`createdAt`);

-- CreateIndex
CREATE INDEX `order_place_createdAt_idx` ON `order_place`(`createdAt`);

-- CreateIndex
CREATE INDEX `order_place_orderStatus_idx` ON `order_place`(`orderStatus`);

-- CreateIndex
CREATE INDEX `payout_createdAt_idx` ON `payout`(`createdAt`);

-- CreateIndex
CREATE INDEX `payout_status_idx` ON `payout`(`status`);

-- CreateIndex
CREATE INDEX `plan_purchases_createdAt_idx` ON `plan_purchases`(`createdAt`);

-- CreateIndex
CREATE INDEX `plan_purchases_status_idx` ON `plan_purchases`(`status`);
