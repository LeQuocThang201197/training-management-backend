-- CreateEnum
CREATE TYPE "training_management"."TeamGender" AS ENUM ('MALE', 'FEMALE', 'MIXED');

-- CreateEnum
CREATE TYPE "training_management"."TeamType" AS ENUM ('JUNIOR', 'ADULT', 'DISABILITY');

-- CreateEnum
CREATE TYPE "training_management"."ManagementRoom" AS ENUM ('ROOM_1', 'ROOM_2', 'ROOM_3');

-- CreateTable
CREATE TABLE "training_management"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sportId" INTEGER NOT NULL,
    "type" "training_management"."TeamType" NOT NULL,
    "room" "training_management"."ManagementRoom" NOT NULL,
    "gender" "training_management"."TeamGender" NOT NULL DEFAULT 'MIXED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "training_management"."Team"("name");

-- AddForeignKey
ALTER TABLE "training_management"."Team" ADD CONSTRAINT "Team_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "training_management"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
