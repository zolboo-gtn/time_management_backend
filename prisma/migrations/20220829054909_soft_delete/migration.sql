/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `approvedById` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_approvedById_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "approvedAt",
DROP COLUMN "approvedById",
ADD COLUMN     "evaluatedAt" TIMESTAMP(3),
ADD COLUMN     "evaluatedById" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_evaluatedById_fkey" FOREIGN KEY ("evaluatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
