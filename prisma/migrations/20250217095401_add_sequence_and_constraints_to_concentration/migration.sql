/*
  Warnings:

  - A unique constraint covering the columns `[teamId,related_year,sequence_number]` on the table `Concentration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `related_year` to the `Concentration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence_number` to the `Concentration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "training_management"."Concentration" ADD COLUMN     "related_year" INTEGER NOT NULL,
ADD COLUMN     "sequence_number" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Concentration_teamId_startDate_endDate_idx" ON "training_management"."Concentration"("teamId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Concentration_teamId_related_year_sequence_number_key" ON "training_management"."Concentration"("teamId", "related_year", "sequence_number");
