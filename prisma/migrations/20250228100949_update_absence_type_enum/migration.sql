/*
  Warnings:

  - The values [NOT_JOINED,REMOVED] on the enum `AbsenceType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `createdBy` to the `AbsenceRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "training_management"."AbsenceType_new" AS ENUM ('INACTIVE', 'TRAINING', 'COMPETITION', 'LEAVE');
ALTER TABLE "training_management"."AbsenceRecord" ALTER COLUMN "type" TYPE "training_management"."AbsenceType_new" USING ("type"::text::"training_management"."AbsenceType_new");
ALTER TYPE "training_management"."AbsenceType" RENAME TO "AbsenceType_old";
ALTER TYPE "training_management"."AbsenceType_new" RENAME TO "AbsenceType";
DROP TYPE "training_management"."AbsenceType_old";
COMMIT;

-- AlterTable
ALTER TABLE "training_management"."AbsenceRecord" ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "training_management"."AbsenceRecord" ADD CONSTRAINT "AbsenceRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
