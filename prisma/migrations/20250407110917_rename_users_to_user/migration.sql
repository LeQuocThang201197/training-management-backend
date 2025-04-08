/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."UserRole" DROP CONSTRAINT "UserRole_user_id_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."AbsenceRecord" DROP CONSTRAINT "AbsenceRecord_created_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."Competition" DROP CONSTRAINT "Competition_created_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_created_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."Concentration" DROP CONSTRAINT "Concentration_created_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."Paper" DROP CONSTRAINT "Paper_created_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" DROP CONSTRAINT "PaperOnConcentration_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" DROP CONSTRAINT "PersonOnConcentration_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."Training" DROP CONSTRAINT "Training_created_by_fkey";

-- DropForeignKey
ALTER TABLE "training_management"."TrainingParticipant" DROP CONSTRAINT "TrainingParticipant_created_by_fkey";

-- DropTable
DROP TABLE "auth"."users";

-- CreateTable
CREATE TABLE "auth"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "auth"."User"("email");

-- AddForeignKey
ALTER TABLE "auth"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Paper" ADD CONSTRAINT "Paper_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Concentration" ADD CONSTRAINT "Concentration_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Training" ADD CONSTRAINT "Training_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Competition" ADD CONSTRAINT "Competition_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
