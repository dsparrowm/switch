/*
  Warnings:

  - You are about to drop the column `invitationId` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inviteLink` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_userId_fkey";

-- AlterTable
ALTER TABLE "Organisation" DROP COLUMN "invitationId",
ADD COLUMN     "inviteLink" TEXT NOT NULL;

-- DropTable
DROP TABLE "Invitation";
