-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
