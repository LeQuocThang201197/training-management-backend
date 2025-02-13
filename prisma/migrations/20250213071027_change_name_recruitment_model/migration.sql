/*
  Warnings:

  - You are about to drop the `Recruiment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "training_management"."Recruiment" DROP CONSTRAINT "Recruiment_submitter_id_fkey";

-- DropTable
DROP TABLE "training_management"."Recruiment";

-- CreateTable
CREATE TABLE "training_management"."Recruitment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "submitter_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recruitment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "training_management"."Recruitment" ADD CONSTRAINT "Recruitment_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
