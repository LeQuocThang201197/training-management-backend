/*
  Warnings:

  - The values [TRAINING,COMPETITION] on the enum `AbsenceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `competition_id` on the `AbsenceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `training_id` on the `AbsenceRecord` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "training_management"."AbsenceType_new" AS ENUM ('INACTIVE', 'LEAVE');
ALTER TABLE "training_management"."AbsenceRecord" ALTER COLUMN "type" TYPE "training_management"."AbsenceType_new" USING ("type"::text::"training_management"."AbsenceType_new");
ALTER TYPE "training_management"."AbsenceType" RENAME TO "AbsenceType_old";
ALTER TYPE "training_management"."AbsenceType_new" RENAME TO "AbsenceType";
DROP TYPE "training_management"."AbsenceType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "training_management"."AbsenceRecord" DROP CONSTRAINT "AbsenceRecord_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."AbsenceRecord" DROP CONSTRAINT "AbsenceRecord_training_id_fkey";

-- AlterTable
ALTER TABLE "training_management"."AbsenceRecord" DROP COLUMN "competition_id",
DROP COLUMN "training_id";

-- CreateTable
CREATE TABLE "training_management"."TrainingParticipant" (
    "id" SERIAL NOT NULL,
    "participation_id" INTEGER NOT NULL,
    "training_id" INTEGER NOT NULL,
    "note" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."CompetitionParticipant" (
    "id" SERIAL NOT NULL,
    "participation_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "note" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingParticipant_participation_id_training_id_key" ON "training_management"."TrainingParticipant"("participation_id", "training_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionParticipant_participation_id_competition_id_key" ON "training_management"."CompetitionParticipant"("participation_id", "competition_id");

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training_management"."Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "training_management"."Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
