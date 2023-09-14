/*
  Warnings:

  - A unique constraint covering the columns `[userId,roleId,organisationId]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organisationId` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserRole_userId_roleId_key";

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "organisationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_organisationId_key" ON "UserRole"("userId", "roleId", "organisationId");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
