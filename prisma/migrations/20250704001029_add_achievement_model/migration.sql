-- CreateTable
CREATE TABLE "training_management"."Achievement" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_category" TEXT,
    "result_value" TEXT NOT NULL,
    "result_unit" TEXT NOT NULL,
    "medal_type" TEXT,
    "rank" INTEGER,
    "note" TEXT,
    "is_record" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "training_management"."Achievement" ADD CONSTRAINT "Achievement_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "training_management"."Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Achievement" ADD CONSTRAINT "Achievement_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "training_management"."Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_management"."Achievement" ADD CONSTRAINT "Achievement_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
