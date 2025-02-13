-- CreateTable
CREATE TABLE "training_management"."Recruiment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "submitter_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recruiment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "training_management"."Recruiment" ADD CONSTRAINT "Recruiment_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
