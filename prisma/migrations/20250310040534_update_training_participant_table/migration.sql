/*
  Warnings:

  - The primary key for the `TrainingParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TrainingParticipant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "training_management"."TrainingParticipant_participation_id_training_id_key";

-- AlterTable
ALTER TABLE "training_management"."TrainingParticipant" DROP CONSTRAINT "TrainingParticipant_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "TrainingParticipant_pkey" PRIMARY KEY ("participation_id", "training_id");
