/*
  Warnings:

  - Made the column `concentration_id` on table `CompetitionParticipant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `person_id` on table `CompetitionParticipant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role_id` on table `CompetitionParticipant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_concentration_id_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_person_id_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_role_id_fkey";

-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" ALTER COLUMN "concentration_id" SET NOT NULL,
ALTER COLUMN "person_id" SET NOT NULL,
ALTER COLUMN "role_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "training_management"."Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "training_management"."PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
