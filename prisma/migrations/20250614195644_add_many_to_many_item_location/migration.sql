/*
  Warnings:

  - You are about to drop the column `locationId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_locationId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "locationId";

-- CreateTable
CREATE TABLE "ItemLocation" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemLocation_itemId_idx" ON "ItemLocation"("itemId");

-- CreateIndex
CREATE INDEX "ItemLocation_locationId_idx" ON "ItemLocation"("locationId");

-- AddForeignKey
ALTER TABLE "ItemLocation" ADD CONSTRAINT "ItemLocation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLocation" ADD CONSTRAINT "ItemLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
