/*
  Warnings:

  - You are about to drop the column `affiliation_id` on the `PersonOnConcentration` table. All the data in the column will be lost.
  - You are about to drop the `Affiliation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organization_id` to the `PersonOnConcentration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "training_management"."OrganizationType" AS ENUM ('PROVINCE', 'CENTER', 'OTHER');

-- DropForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" DROP CONSTRAINT "PersonOnConcentration_affiliation_id_fkey";

-- DropIndex
DROP INDEX "training_management"."PersonOnConcentration_affiliation_id_idx";

-- AlterTable
ALTER TABLE "training_management"."PersonOnConcentration" DROP COLUMN "affiliation_id",
ADD COLUMN     "organization_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "training_management"."Affiliation";

-- DropEnum
DROP TYPE "training_management"."AffiliationType";

-- CreateTable
CREATE TABLE "training_management"."Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "training_management"."OrganizationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_type_key" ON "training_management"."Organization"("name", "type");

-- CreateIndex
CREATE INDEX "PersonOnConcentration_organization_id_idx" ON "training_management"."PersonOnConcentration"("organization_id");

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "training_management"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
