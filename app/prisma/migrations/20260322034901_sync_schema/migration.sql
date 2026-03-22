/*
  Warnings:

  - You are about to drop the column `isCorrect` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `Option` table. All the data in the column will be lost.
  - Added the required column `Correct` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Correct` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "isCorrect",
ADD COLUMN     "Correct" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "correct",
ADD COLUMN     "Correct" BOOLEAN NOT NULL;
