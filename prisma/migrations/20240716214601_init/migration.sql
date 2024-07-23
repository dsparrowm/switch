-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_assignedTo_fkey";

-- AlterTable
ALTER TABLE "Checklist" ALTER COLUMN "assignedTo" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
