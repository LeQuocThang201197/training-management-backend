/*
  Warnings:

  - You are about to drop the column `endDate` on the `PersonOnConcentration` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PersonOnConcentration` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "training_management"."AbsenceType" AS ENUM ('NOT_JOINED', 'REMOVED', 'TRAINING', 'COMPETITION', 'LEAVE');

-- DropIndex
DROP INDEX "training_management"."PersonOnConcentration_startDate_endDate_idx";

-- AlterTable
ALTER TABLE "training_management"."PersonOnConcentration" DROP COLUMN "endDate",
DROP COLUMN "startDate";

-- CreateTable
CREATE TABLE "training_management"."AbsenceRecord" (
    "id" SERIAL NOT NULL,
    "participation_id" INTEGER NOT NULL,
    "type" "training_management"."AbsenceType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "training_id" INTEGER,
    "competition_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbsenceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "note" TEXT,
    "submitter_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AbsenceRecord_startDate_endDate_idx" ON "training_management"."AbsenceRecord"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training_management"."Training"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "training_management"."Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Competition" ADD CONSTRAINT "Competition_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
