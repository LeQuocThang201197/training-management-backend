-- CreateEnum
CREATE TYPE "training_management"."AffiliationType" AS ENUM ('PROVINCE', 'CENTER', 'OTHER');

-- CreateTable
CREATE TABLE "training_management"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "identity_number" TEXT,
    "identity_date" TIMESTAMP(3),
    "identity_place" TEXT,
    "social_insurance" TEXT,
    "birthday" TIMESTAMP(3),
    "gender" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Affiliation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "training_management"."AffiliationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Affiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."PersonOnConcentration" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "concentration_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "assignedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "affiliation_id" INTEGER NOT NULL,

    CONSTRAINT "PersonOnConcentration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "training_management"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliation_name_type_key" ON "training_management"."Affiliation"("name", "type");

-- CreateIndex
CREATE INDEX "PersonOnConcentration_startDate_endDate_idx" ON "training_management"."PersonOnConcentration"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "PersonOnConcentration_concentration_id_idx" ON "training_management"."PersonOnConcentration"("concentration_id");

-- CreateIndex
CREATE INDEX "PersonOnConcentration_affiliation_id_idx" ON "training_management"."PersonOnConcentration"("affiliation_id");

-- CreateIndex
CREATE INDEX "Concentration_teamId_idx" ON "training_management"."Concentration"("teamId");

-- CreateIndex
CREATE INDEX "Team_sportId_idx" ON "training_management"."Team"("sportId");

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "training_management"."Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "training_management"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_affiliation_id_fkey" FOREIGN KEY ("affiliation_id") REFERENCES "training_management"."Affiliation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
