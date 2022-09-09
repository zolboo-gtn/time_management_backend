/*
  Warnings:

  - You are about to drop the column `isNormal` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "isNormal",
ALTER COLUMN "status" SET DEFAULT 'PENDING';
