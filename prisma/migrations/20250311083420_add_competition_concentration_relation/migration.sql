/*
  Warnings:

  - Added the required column `concentration_id` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "training_management"."Competition" ADD COLUMN     "concentration_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Competition_concentration_id_idx" ON "training_management"."Competition"("concentration_id");

-- AddForeignKey
ALTER TABLE "training_management"."Competition" ADD CONSTRAINT "Competition_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
