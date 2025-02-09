-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
