-- This is an empty migration.

-- Copy existing competition-concentration relationships to the new junction table
INSERT INTO "training_management"."CompetitionConcentration" ("competition_id", "concentration_id", "createdAt")
SELECT "id", "concentration_id", "createdAt"
FROM "training_management"."Competition"
WHERE "concentration_id" IS NOT NULL;