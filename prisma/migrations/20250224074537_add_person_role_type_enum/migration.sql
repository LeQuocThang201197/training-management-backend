/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "training_management"."PersonRoleType" AS ENUM ('ATHLETE', 'COACH', 'OTHER');

-- DropForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" DROP CONSTRAINT "PersonOnConcentration_role_id_fkey";

-- DropTable
DROP TABLE "training_management"."Role";

-- CreateTable
CREATE TABLE "training_management"."PersonRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "training_management"."PersonRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonRole_name_key" ON "training_management"."PersonRole"("name");

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "training_management"."PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
