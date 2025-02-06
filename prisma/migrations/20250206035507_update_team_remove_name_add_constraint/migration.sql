/*
  Warnings:

  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sportId,type,gender]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "training_management"."Team_name_key";

-- AlterTable
ALTER TABLE "training_management"."Team" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Team_sportId_type_gender_key" ON "training_management"."Team"("sportId", "type", "gender");
