/*
  Warnings:

  - You are about to drop the column `email` on the `OTP` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "OTP_email_key";

-- AlterTable
ALTER TABLE "OTP" DROP COLUMN "email",
ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
