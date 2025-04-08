/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `userId` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `AbsenceRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `Competition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `CompetitionParticipant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `Concentration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `Paper` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assigned_by` on the `PaperOnConcentration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assigned_by` on the `PersonOnConcentration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `Training` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `TrainingParticipant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

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
ALTER TABLE "auth"."Profile" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "auth"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "auth"."UserRole" DROP CONSTRAINT "UserRole_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id", "role_id");

-- AlterTable
ALTER TABLE "training_management"."AbsenceRecord" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."Competition" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."Concentration" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."Paper" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."PaperOnConcentration" DROP COLUMN "assigned_by",
ADD COLUMN     "assigned_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."PersonOnConcentration" DROP COLUMN "assigned_by",
ADD COLUMN     "assigned_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."Training" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."TrainingParticipant" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "auth"."Profile"("userId");

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
