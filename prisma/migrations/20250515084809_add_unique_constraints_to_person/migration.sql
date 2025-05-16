/*
  Warnings:

  - A unique constraint covering the columns `[identity_number]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[social_insurance]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Person_identity_number_key" ON "training_management"."Person"("identity_number");

-- CreateIndex
CREATE UNIQUE INDEX "Person_social_insurance_key" ON "training_management"."Person"("social_insurance");
