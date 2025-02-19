-- AlterTable
ALTER TABLE "training_management"."Paper" ADD COLUMN     "submitter_id" INTEGER;

-- AddForeignKey
ALTER TABLE "training_management"."Paper" ADD CONSTRAINT "Paper_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "auth"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
