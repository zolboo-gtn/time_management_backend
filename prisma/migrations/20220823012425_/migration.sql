/*
  Warnings:

  - The `status` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('REMOTE', 'OFFICE', 'HOLIDAY', 'DAYOFF', 'SICK', 'ABSENT');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('APPROVED', 'DECLINED', 'PENDING', 'CANCELED');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "type" "AttendanceType" NOT NULL DEFAULT E'REMOTE',
DROP COLUMN "status",
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT E'APPROVED';

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "CardAttendance" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timestamps" TIMESTAMP(3)[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CardAttendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardAttendance" ADD CONSTRAINT "CardAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
