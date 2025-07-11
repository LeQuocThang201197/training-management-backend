-- Update participant_id based on existing person_id and concentration_id
UPDATE "training_management"."CompetitionParticipant" 
SET "participant_id" = (
    SELECT poc.id 
    FROM "training_management"."PersonOnConcentration" poc 
    WHERE poc.person_id = "CompetitionParticipant".person_id 
    AND poc.concentration_id = "CompetitionParticipant".concentration_id
    LIMIT 1
)
WHERE "participant_id" IS NULL;