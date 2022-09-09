/*
  Warnings:

  - You are about to drop the column `timestamps` on the `Attendance` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('REMOTE', 'OFFICE', 'HOLIDAY', 'DAYOFF', 'SICK', 'ABSENT');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "timestamps",
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT E'OFFICE';
