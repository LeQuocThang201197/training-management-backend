-- This is an empty migration.

-- Migration dữ liệu từ participation_id sang person_id, role_id, concentration_id
UPDATE "training_management"."CompetitionParticipant" 
SET 
    person_id = poc.person_id,
    role_id = poc.role_id,
    concentration_id = poc.concentration_id
FROM "training_management"."PersonOnConcentration" poc
WHERE "CompetitionParticipant".participation_id = poc.id;