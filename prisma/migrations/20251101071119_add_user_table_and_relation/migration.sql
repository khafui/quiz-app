/*
  Warnings:

  - Made the column `quizId` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quizId` on table `QuizResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizResult" DROP CONSTRAINT "QuizResult_quizId_fkey";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "quizId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "QuizResult" ALTER COLUMN "quizId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
