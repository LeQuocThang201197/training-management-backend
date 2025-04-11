/*
  Warnings:

  - You are about to drop the column `room` on the `Team` table. All the data in the column will be lost.
  - Added the required column `room` to the `Concentration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "training_management"."Concentration" ADD COLUMN     "room" "training_management"."ManagementRoom" NOT NULL;

-- AlterTable
ALTER TABLE "training_management"."Team" DROP COLUMN "room";
