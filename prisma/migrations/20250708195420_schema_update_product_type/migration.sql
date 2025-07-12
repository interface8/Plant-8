-- AlterTable
ALTER TABLE "ProductType" ADD COLUMN     "durationId" UUID,
ADD COLUMN     "expectedReturnRate" DOUBLE PRECISION,
ADD COLUMN     "growthDuration" TEXT;

-- AddForeignKey
ALTER TABLE "ProductType" ADD CONSTRAINT "ProductType_durationId_fkey" FOREIGN KEY ("durationId") REFERENCES "ProductType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
