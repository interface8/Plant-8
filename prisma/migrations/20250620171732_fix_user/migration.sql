-- AlterTable
ALTER TABLE "User" ADD COLUMN     "modifiedById" UUID,
ADD COLUMN     "modifiedOn" TIMESTAMP(6);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
