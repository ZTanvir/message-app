/*
  Warnings:

  - You are about to drop the column `participants` on the `Conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[use1Id,user2Id]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `use1Id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Id` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Conversation_participants_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "participants",
ADD COLUMN     "use1Id" TEXT NOT NULL,
ADD COLUMN     "user2Id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_use1Id_user2Id_key" ON "Conversation"("use1Id", "user2Id");
