/*
  Warnings:

  - You are about to drop the column `image` on the `Sport` table. All the data in the column will be lost.
  - You are about to drop the column `rules` on the `Sport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "training_management"."Sport" DROP COLUMN "image",
DROP COLUMN "rules";
