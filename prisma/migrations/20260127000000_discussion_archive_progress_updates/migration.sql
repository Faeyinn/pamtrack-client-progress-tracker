-- CreateEnum
CREATE TYPE "ProjectPhase" AS ENUM ('DISCOVERY', 'DESIGN', 'DEVELOPMENT', 'QA', 'LAUNCH', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('WIREFRAME', 'USER_FLOW', 'MEETING_NOTES', 'OTHER');

-- CreateTable
CREATE TABLE "discussion_artifacts" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "phase" "ProjectPhase" NOT NULL,
    "type" "ArtifactType",
    "file_name" TEXT,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "file_data" BYTEA,
    "source_link_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discussion_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_updates" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "phase" "ProjectPhase",
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_update_images" (
    "id" TEXT NOT NULL,
    "progress_update_id" TEXT NOT NULL,
    "file_name" TEXT,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "file_data" BYTEA NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_update_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_update_links" (
    "id" TEXT NOT NULL,
    "progress_update_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_update_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "discussion_artifacts_project_id_idx" ON "discussion_artifacts"("project_id");

-- CreateIndex
CREATE INDEX "discussion_artifacts_project_id_phase_idx" ON "discussion_artifacts"("project_id", "phase");

-- CreateIndex
CREATE INDEX "progress_updates_project_id_idx" ON "progress_updates"("project_id");

-- CreateIndex
CREATE INDEX "progress_updates_project_id_created_at_idx" ON "progress_updates"("project_id", "created_at");

-- CreateIndex
CREATE INDEX "progress_update_images_progress_update_id_idx" ON "progress_update_images"("progress_update_id");

-- CreateIndex
CREATE INDEX "progress_update_links_progress_update_id_idx" ON "progress_update_links"("progress_update_id");

-- AddForeignKey
ALTER TABLE "discussion_artifacts" ADD CONSTRAINT "discussion_artifacts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_updates" ADD CONSTRAINT "progress_updates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_update_images" ADD CONSTRAINT "progress_update_images_progress_update_id_fkey" FOREIGN KEY ("progress_update_id") REFERENCES "progress_updates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_update_links" ADD CONSTRAINT "progress_update_links_progress_update_id_fkey" FOREIGN KEY ("progress_update_id") REFERENCES "progress_updates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
