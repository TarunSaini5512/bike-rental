-- AlterTable
ALTER TABLE `User` ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpExpiry` DATETIME(3) NULL;
