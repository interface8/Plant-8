/*
  Warnings:

  - You are about to drop the column `plotSize` on the `Investment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "plotSize",
ADD COLUMN     "numberOfPlots" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "numberOfTerms" INTEGER NOT NULL DEFAULT 1;
