/*
  Warnings:

  - You are about to drop the column `investorId` on the `MarketplaceListing` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[investmentId]` on the table `MarketplaceListing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `harvestDate` to the `MarketplaceListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MarketplaceListing" DROP CONSTRAINT "MarketplaceListing_investmentId_fkey";

-- DropForeignKey
ALTER TABLE "MarketplaceListing" DROP CONSTRAINT "MarketplaceListing_investorId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_listingId_fkey";

-- DropIndex
DROP INDEX "MarketplaceListing_investorId_idx";

-- AlterTable
ALTER TABLE "MarketplaceListing" DROP COLUMN "investorId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "harvestDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalPrice",
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "deliveryAddress" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "buyerId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceListing_investmentId_key" ON "MarketplaceListing"("investmentId");

-- CreateIndex
CREATE INDEX "MarketplaceListing_status_idx" ON "MarketplaceListing"("status");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- AddForeignKey
ALTER TABLE "MarketplaceListing" ADD CONSTRAINT "MarketplaceListing_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MarketplaceListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
