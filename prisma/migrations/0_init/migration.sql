-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "training_management";

-- CreateEnum
CREATE TYPE "training_management"."PersonRoleType" AS ENUM ('ATHLETE', 'COACH', 'OTHER', 'SPECIALIST');

-- CreateEnum
CREATE TYPE "training_management"."TeamGender" AS ENUM ('MALE', 'FEMALE', 'MIXED');

-- CreateEnum
CREATE TYPE "training_management"."TeamType" AS ENUM ('JUNIOR', 'ADULT', 'DISABILITY');

-- CreateEnum
CREATE TYPE "training_management"."ManagementRoom" AS ENUM ('ROOM_1', 'ROOM_2', 'ROOM_3', 'ROOM');

-- CreateEnum
CREATE TYPE "training_management"."OrganizationType" AS ENUM ('PROVINCE', 'OTHER');

-- CreateEnum
CREATE TYPE "training_management"."AbsenceType" AS ENUM ('INACTIVE', 'LEAVE');

-- CreateTable
CREATE TABLE "training_management"."PersonRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "training_management"."PersonRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."Profile" (
    "id" SERIAL NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Sport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Team" (
    "id" SERIAL NOT NULL,
    "sportId" INTEGER NOT NULL,
    "type" "training_management"."TeamType" NOT NULL,
    "gender" "training_management"."TeamGender" NOT NULL DEFAULT 'MIXED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Paper" (
    "id" SERIAL NOT NULL,
    "number" INTEGER,
    "code" TEXT,
    "publisher" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "related_year" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "file_name" TEXT,
    "file_path" TEXT,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Concentration" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "related_year" INTEGER NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "room" "training_management"."ManagementRoom" NOT NULL,

    CONSTRAINT "Concentration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Training" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "concentration_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isForeign" BOOLEAN NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."TrainingParticipant" (
    "participation_id" INTEGER NOT NULL,
    "training_id" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "TrainingParticipant_pkey" PRIMARY KEY ("participation_id","training_id")
);

-- CreateTable
CREATE TABLE "training_management"."PaperOnConcentration" (
    "paper_id" INTEGER NOT NULL,
    "concentration_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" INTEGER NOT NULL,

    CONSTRAINT "PaperOnConcentration_pkey" PRIMARY KEY ("paper_id","concentration_id")
);

-- CreateTable
CREATE TABLE "training_management"."Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "identity_number" TEXT,
    "identity_date" TIMESTAMP(3),
    "identity_place" TEXT,
    "social_insurance" TEXT,
    "birthday" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "training_management"."OrganizationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."PersonOnConcentration" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "concentration_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "assigned_by" INTEGER NOT NULL,

    CONSTRAINT "PersonOnConcentration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."AbsenceRecord" (
    "id" SERIAL NOT NULL,
    "participation_id" INTEGER NOT NULL,
    "type" "training_management"."AbsenceType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "AbsenceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."Competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isForeign" BOOLEAN NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "concentration_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_management"."CompetitionParticipant" (
    "participation_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY ("participation_id","competition_id")
);

-- CreateTable
CREATE TABLE "auth"."Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."RolePermission" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "auth"."UserRole" (
    "role_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "auth"."schema_migrations" (
    "version" VARCHAR(14) NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonRole_name_key" ON "training_management"."PersonRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "auth"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "training_management"."Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "training_management"."Sport"("name");

-- CreateIndex
CREATE INDEX "Team_sportId_idx" ON "training_management"."Team"("sportId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_sportId_type_gender_key" ON "training_management"."Team"("sportId", "type", "gender");

-- CreateIndex
CREATE INDEX "Concentration_teamId_idx" ON "training_management"."Concentration"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_type_key" ON "training_management"."Organization"("name", "type");

-- CreateIndex
CREATE INDEX "PersonOnConcentration_concentration_id_idx" ON "training_management"."PersonOnConcentration"("concentration_id");

-- CreateIndex
CREATE INDEX "PersonOnConcentration_organization_id_idx" ON "training_management"."PersonOnConcentration"("organization_id");

-- CreateIndex
CREATE INDEX "AbsenceRecord_startDate_endDate_idx" ON "training_management"."AbsenceRecord"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Competition_concentration_id_idx" ON "training_management"."Competition"("concentration_id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "auth"."Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "auth"."Role"("name");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "public"."sessions"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "schema_migrations_version_idx" ON "auth"."schema_migrations"("version");

-- AddForeignKey
ALTER TABLE "auth"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Team" ADD CONSTRAINT "Team_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "training_management"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Paper" ADD CONSTRAINT "Paper_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Concentration" ADD CONSTRAINT "Concentration_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Concentration" ADD CONSTRAINT "Concentration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "training_management"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Training" ADD CONSTRAINT "Training_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Training" ADD CONSTRAINT "Training_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training_management"."Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PaperOnConcentration" ADD CONSTRAINT "PaperOnConcentration_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "training_management"."Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Person" ADD CONSTRAINT "Person_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "training_management"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "training_management"."Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."PersonOnConcentration" ADD CONSTRAINT "PersonOnConcentration_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "training_management"."PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Competition" ADD CONSTRAINT "Competition_concentration_id_fkey" FOREIGN KEY ("concentration_id") REFERENCES "training_management"."Concentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Competition" ADD CONSTRAINT "Competition_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "training_management"."Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "training_management"."PersonOnConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

