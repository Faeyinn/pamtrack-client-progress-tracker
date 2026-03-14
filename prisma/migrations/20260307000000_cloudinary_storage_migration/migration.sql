-- AlterTable
ALTER TABLE "discussion_artifacts"
ADD COLUMN "file_url" TEXT,
ADD COLUMN "cloudinary_public_id" TEXT;

-- AlterTable
ALTER TABLE "progress_update_images"
ADD COLUMN "cloudinary_public_id" TEXT;

-- DataMigration
UPDATE "discussion_artifacts"
SET "file_url" = "source_link_url"
WHERE "file_name" IS NOT NULL
  AND "source_link_url" IS NOT NULL
  AND "file_url" IS NULL;
