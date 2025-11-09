-- AlterTable: Add dailyMaintenanceFee to Product, rename fields on Land
ALTER TABLE "Product" ADD COLUMN "dailyMaintenanceFee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable: Update Land table
ALTER TABLE "Land" DROP COLUMN "farmerDailyWage",
DROP COLUMN "fullPlotPrice",
DROP COLUMN "halfPlotPrice",
ADD COLUMN "dailyPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
