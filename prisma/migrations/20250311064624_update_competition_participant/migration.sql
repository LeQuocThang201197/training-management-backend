/*
  Warnings:

  - You are about to drop the column `description` on the `Competition` table. All the data in the column will be lost.
  - The primary key for the `CompetitionParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CompetitionParticipant` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `CompetitionParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `CompetitionParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "training_management"."CompetitionParticipant_participation_id_competition_id_key";

-- AlterTable
ALTER TABLE "training_management"."Competition" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "training_management"."CompetitionParticipant" DROP CONSTRAINT "CompetitionParticipant_pkey",
DROP COLUMN "id",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY ("participation_id", "competition_id");
