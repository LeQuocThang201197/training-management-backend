-- CreateTable
CREATE TABLE "training_management"."CompetitionConcentration" (
    "competition_id" INTEGER NOT NULL,
    "concentration_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitionConcentration_pkey" PRIMARY KEY ("competition_id","concentration_id")
);

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionConcentration" ADD CONSTRAINT "CompetitionConcentration_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "training_management"."Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionConcentration" ADD CONSTRAINT "CompetitionConcentration_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
