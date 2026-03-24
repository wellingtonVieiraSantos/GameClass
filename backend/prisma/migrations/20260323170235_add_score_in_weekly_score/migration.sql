/*
  Warnings:

  - A unique constraint covering the columns `[studentId,week,year,classroomId]` on the table `WeeklyScore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Reason" AS ENUM ('BEHAVIOR', 'TASK', 'ATTENDANCE', 'PARTICIPATION', 'OTHER');

-- AlterTable
ALTER TABLE "WeeklyScore" ADD COLUMN     "reason" "Reason" NOT NULL DEFAULT 'OTHER';

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyScore_studentId_week_year_classroomId_key" ON "WeeklyScore"("studentId", "week", "year", "classroomId");
