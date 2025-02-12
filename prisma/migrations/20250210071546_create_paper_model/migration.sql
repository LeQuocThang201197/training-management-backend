/*
  Warnings:

  - A unique constraint covering the columns `[value,type]` on the table `Allcode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "training_management"."Paper" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "related_year" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Allcode_value_type_key" ON "training_management"."Allcode"("value", "type");
