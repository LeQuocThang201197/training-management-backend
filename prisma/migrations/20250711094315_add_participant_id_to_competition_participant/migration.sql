-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" ADD COLUMN     "participant_id" INTEGER;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
