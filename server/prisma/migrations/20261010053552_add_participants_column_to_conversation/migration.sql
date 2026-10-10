/*
  Warnings:

  - A unique constraint covering the columns `[participants]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participants` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "participants" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_participants_key" ON "Conversation"("participants");
