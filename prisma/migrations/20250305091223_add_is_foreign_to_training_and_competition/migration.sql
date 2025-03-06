/*
  Warnings:

  - Added the required column `isForeign` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isForeign` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "training_management"."Competition" ADD COLUMN     "isForeign" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."Training" ADD COLUMN     "isForeign" BOOLEAN NOT NULL;
