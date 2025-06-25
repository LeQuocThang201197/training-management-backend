/*
  Warnings:

  - You are about to drop the column `concentration_id` on the `Competition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "training_management"."Competition" DROP CONSTRAINT "Competition_concentration_id_fkey";

-- DropIndex
DROP INDEX "training_management"."Competition_concentration_id_idx";

-- AlterTable
ALTER TABLE "training_management"."Competition" DROP COLUMN "concentration_id";
