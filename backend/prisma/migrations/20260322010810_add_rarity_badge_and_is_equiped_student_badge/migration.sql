/*
  Warnings:

  - You are about to drop the column `points` on the `WeeklyScore` table. All the data in the column will be lost.
  - Added the required column `classroomId` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `WeeklyScore` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "classroomId" TEXT NOT NULL,
ADD COLUMN     "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
ALTER COLUMN "icon" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudentBadge" ADD COLUMN     "isEquipped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WeeklyScore" DROP COLUMN "points",
ADD COLUMN     "score" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
