/*
  Warnings:

  - The primary key for the `CompetitionParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `participation_id` on the `CompetitionParticipant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_participation_id_fkey";

-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_pkey",
DROP COLUMN "participation_id",
ADD CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY ("person_id", "competition_id");
