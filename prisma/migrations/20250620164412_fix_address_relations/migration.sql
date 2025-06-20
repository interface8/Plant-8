-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "modifiedById" UUID,
ADD COLUMN     "modifiedOn" TIMESTAMP(6);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
