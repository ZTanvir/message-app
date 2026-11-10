/*
  Warnings:

  - You are about to drop the column `use1Id` on the `Conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user1Id,user2Id]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user1Id` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Conversation_use1Id_user2Id_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "use1Id",
ADD COLUMN     "user1Id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user1Id_user2Id_key" ON "Conversation"("user1Id", "user2Id");
