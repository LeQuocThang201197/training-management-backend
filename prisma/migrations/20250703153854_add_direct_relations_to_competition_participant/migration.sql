-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" ADD COLUMN     "concentration_id" INTEGER,
ADD COLUMN     "person_id" INTEGER,
ADD COLUMN     "role_id" INTEGER;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "training_management"."Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "training_management"."PersonRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
