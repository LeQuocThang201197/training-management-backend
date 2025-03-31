/*
  Warnings:

  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_by` on table `Paper` required. This step will fail if there are existing NULL values in that column.

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

-- AlterTable
ALTER TABLE "auth"."Profile" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "auth"."Role" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "auth"."UserRole" DROP CONSTRAINT "UserRole_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id", "role_id");

-- AlterTable
ALTER TABLE "training_management"."AbsenceRecord" ALTER COLUMN "created_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."Competition" ALTER COLUMN "created_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" ALTER COLUMN "created_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."Concentration" ALTER COLUMN "created_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."Paper" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "created_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."PaperOnConcentration" ALTER COLUMN "assigned_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."PersonOnConcentration" ALTER COLUMN "assigned_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."Training" ALTER COLUMN "created_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "training_management"."TrainingParticipant" ALTER COLUMN "created_by" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "auth"."User";

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- AddForeignKey
ALTER TABLE "auth"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Paper" ADD CONSTRAINT "Paper_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Concentration" ADD CONSTRAINT "Concentration_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Training" ADD CONSTRAINT "Training_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Competition" ADD CONSTRAINT "Competition_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
