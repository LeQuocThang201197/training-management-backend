-- Drop foreign keys trước khi đổi tên cột
ALTER TABLE "training_management"."AbsenceRecord" DROP CONSTRAINT IF EXISTS "AbsenceRecord_createdBy_fkey";
ALTER TABLE "training_management"."Competition" DROP CONSTRAINT IF EXISTS "Competition_submitter_id_fkey";
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT IF EXISTS "CompetitionParticipant_createdBy_fkey";
ALTER TABLE "training_management"."Concentration" DROP CONSTRAINT IF EXISTS "Concentration_submitter_id_fkey";
ALTER TABLE "training_management"."Paper" DROP CONSTRAINT IF EXISTS "Paper_submitter_id_fkey";
ALTER TABLE "training_management"."Training" DROP CONSTRAINT IF EXISTS "Training_submitter_id_fkey";
ALTER TABLE "training_management"."TrainingParticipant" DROP CONSTRAINT IF EXISTS "TrainingParticipant_createdBy_fkey";

-- Đổi tên các cột (giữ nguyên dữ liệu)
ALTER TABLE "training_management"."AbsenceRecord" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "training_management"."TrainingParticipant" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "training_management"."CompetitionParticipant" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "training_management"."PersonOnConcentration" RENAME COLUMN "assignedBy" TO "assigned_by";
ALTER TABLE "training_management"."PaperOnConcentration" RENAME COLUMN "assignedBy" TO "assigned_by";
ALTER TABLE "training_management"."Paper" RENAME COLUMN "submitter_id" TO "created_by";
ALTER TABLE "training_management"."Concentration" RENAME COLUMN "submitter_id" TO "created_by";
ALTER TABLE "training_management"."Training" RENAME COLUMN "submitter_id" TO "created_by";
ALTER TABLE "training_management"."Competition" RENAME COLUMN "submitter_id" TO "created_by";

-- Thêm lại foreign keys
ALTER TABLE "training_management"."Paper" ADD CONSTRAINT "Paper_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "training_management"."Concentration" ADD CONSTRAINT "Concentration_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "training_management"."Training" ADD CONSTRAINT "Training_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "training_management"."Competition" ADD CONSTRAINT "Competition_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 