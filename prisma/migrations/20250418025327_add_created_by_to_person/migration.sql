-- AlterTable
ALTER TABLE "training_management"."Person" ADD COLUMN     "created_by" INTEGER NOT NULL DEFAULT 2;

-- AddForeignKey
ALTER TABLE "training_management"."Person" ADD CONSTRAINT "Person_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
