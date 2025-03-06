/*
  Warnings:

  - Changed the type of `gender` on the `Person` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Thêm cột mới
-- Thêm cột mới
ALTER TABLE "training_management"."Person" 
ADD COLUMN "new_gender" BOOLEAN;

-- Chuyển đổi dữ liệu hiện có
UPDATE "training_management"."Person" 
SET "new_gender" = 
  CASE 
    WHEN gender = 'Nam' THEN true
    WHEN gender = 'Nữ' THEN false
  END;

-- Đảm bảo cột mới không null
ALTER TABLE "training_management"."Person" 
ALTER COLUMN "new_gender" SET NOT NULL;

-- Đổi tên cột (PostgreSQL syntax)
ALTER TABLE "training_management"."Person" 
DROP COLUMN "gender";

ALTER TABLE "training_management"."Person" 
RENAME COLUMN "new_gender" TO "gender";