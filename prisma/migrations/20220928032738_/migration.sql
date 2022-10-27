/*
  Warnings:

  - The values [CANCELED] on the enum `AttendanceStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ABSENT] on the enum `AttendanceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AttendanceStatus_new" AS ENUM ('APPROVED', 'DECLINED', 'PENDING', 'CANCELLED');
ALTER TABLE "Attendance" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Attendance" ALTER COLUMN "status" TYPE "AttendanceStatus_new" USING ("status"::text::"AttendanceStatus_new");
ALTER TYPE "AttendanceStatus" RENAME TO "AttendanceStatus_old";
ALTER TYPE "AttendanceStatus_new" RENAME TO "AttendanceStatus";
DROP TYPE "AttendanceStatus_old";
ALTER TABLE "Attendance" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AttendanceType_new" AS ENUM ('REMOTE', 'OFFICE', 'HOLIDAY', 'DAYOFF', 'SICK');
ALTER TABLE "Attendance" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Attendance" ALTER COLUMN "type" TYPE "AttendanceType_new" USING ("type"::text::"AttendanceType_new");
ALTER TYPE "AttendanceType" RENAME TO "AttendanceType_old";
ALTER TYPE "AttendanceType_new" RENAME TO "AttendanceType";
DROP TYPE "AttendanceType_old";
ALTER TABLE "Attendance" ALTER COLUMN "type" SET DEFAULT 'REMOTE';
COMMIT;

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "comment" TEXT;
