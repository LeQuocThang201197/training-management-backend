-- AlterTable
ALTER TABLE "training_management"."Person" ADD COLUMN     "name_search" TEXT;

-- CreateIndex
CREATE INDEX "Person_name_search_idx" ON "training_management"."Person"("name_search");
