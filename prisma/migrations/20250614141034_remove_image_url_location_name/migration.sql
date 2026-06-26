/*
  Warnings:

  - You are about to drop the column `locationId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `changeAmount` on the `PriceChange` table. All the data in the column will be lost.
  - You are about to drop the column `isIncrease` on the `PriceChange` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShippingAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `newPrice` to the `PriceChange` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldPrice` to the `PriceChange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_locationId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingAddress" DROP CONSTRAINT "ShippingAddress_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "shippingAddresses" TEXT[];

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "locationId",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "locationName" TEXT;

-- AlterTable
ALTER TABLE "PriceChange" DROP COLUMN "changeAmount",
DROP COLUMN "isIncrease",
ADD COLUMN     "newPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "oldPrice" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "ShippingAddress";
