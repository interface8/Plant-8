-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" UUID,
ADD COLUMN     "rejectionReason" TEXT;

-- CreateIndex
CREATE INDEX "Blog_approvalStatus_idx" ON "Blog"("approvalStatus");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
