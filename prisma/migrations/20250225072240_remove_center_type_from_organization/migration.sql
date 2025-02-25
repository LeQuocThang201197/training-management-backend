/*
  Warnings:

  - The values [CENTER] on the enum `OrganizationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "training_management"."OrganizationType_new" AS ENUM ('PROVINCE', 'OTHER');
ALTER TABLE "training_management"."Organization" ALTER COLUMN "type" TYPE "training_management"."OrganizationType_new" USING ("type"::text::"training_management"."OrganizationType_new");
ALTER TYPE "training_management"."OrganizationType" RENAME TO "OrganizationType_old";
ALTER TYPE "training_management"."OrganizationType_new" RENAME TO "OrganizationType";
DROP TYPE "training_management"."OrganizationType_old";
COMMIT;
