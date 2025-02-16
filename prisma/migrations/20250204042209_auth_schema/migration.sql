-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `profile` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'DHOBI', 'USER') NOT NULL DEFAULT 'USER',
    `status` ENUM('INVITED', 'PENDING', 'SUSPENDED', 'ACTIVE') NOT NULL DEFAULT 'INVITED',
    `emailVerifiedAt` DATETIME(3) NULL,
    `phoneVerifiedAt` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_phone_idx`(`phone`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
