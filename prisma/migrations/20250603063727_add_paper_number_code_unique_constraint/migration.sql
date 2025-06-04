/*
  Warnings:

  - A unique constraint covering the columns `[number,code]` on the table `Paper` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Paper_number_code_key" ON "training_management"."Paper"("number", "code");
