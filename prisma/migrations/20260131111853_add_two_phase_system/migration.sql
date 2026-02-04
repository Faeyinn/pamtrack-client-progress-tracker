/*
  Warnings:

  - You are about to drop the column `file_data` on the `progress_update_images` table. All the data in the column will be lost.
  - Added the required column `file_url` to the `progress_update_images` table without a default value. This is not possible if the table is not empty.
  - Made the column `phase` on table `progress_updates` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProjectWorkPhase" AS ENUM ('DEVELOPMENT', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "progress_update_images" DROP COLUMN "file_data",
ADD COLUMN     "file_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "progress_updates" ALTER COLUMN "phase" SET NOT NULL;

-- AlterTable
ALTER TABLE "project_logs" ADD COLUMN     "phase" "ProjectWorkPhase" NOT NULL DEFAULT 'DEVELOPMENT',
ADD COLUMN     "progress_update_id" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "current_phase" "ProjectWorkPhase" NOT NULL DEFAULT 'DEVELOPMENT',
ADD COLUMN     "development_completed_at" TIMESTAMP(3),
ADD COLUMN     "development_progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maintenance_progress" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "project_logs_project_id_phase_idx" ON "project_logs"("project_id", "phase");

-- CreateIndex
CREATE INDEX "projects_current_phase_idx" ON "projects"("current_phase");

-- AddForeignKey
ALTER TABLE "project_logs" ADD CONSTRAINT "project_logs_progress_update_id_fkey" FOREIGN KEY ("progress_update_id") REFERENCES "progress_updates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
