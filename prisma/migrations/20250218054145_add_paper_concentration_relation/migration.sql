-- DropIndex
DROP INDEX "training_management"."Concentration_teamId_related_year_sequence_number_key";

-- DropIndex
DROP INDEX "training_management"."Concentration_teamId_startDate_endDate_idx";

-- CreateTable
CREATE TABLE "training_management"."PaperOnConcentration" (
    "paper_id" INTEGER NOT NULL,
    "concentration_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" INTEGER NOT NULL,

    CONSTRAINT "PaperOnConcentration_pkey" PRIMARY KEY ("paper_id","concentration_id")
);

-- AddForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "training_management"."Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
