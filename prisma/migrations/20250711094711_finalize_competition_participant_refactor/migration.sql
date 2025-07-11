/*
  Warnings:

  - The primary key for the `CompetitionParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `concentration_id` on the `CompetitionParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `CompetitionParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `CompetitionParticipant` table. All the data in the column will be lost.
  - Made the column `participant_id` on table `CompetitionParticipant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_concentration_id_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_participant_id_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_person_id_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_role_id_fkey";

-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_pkey",
DROP COLUMN "concentration_id",
DROP COLUMN "person_id",
DROP COLUMN "role_id",
ALTER COLUMN "participant_id" SET NOT NULL,
ADD CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY ("participant_id", "competition_id");

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
