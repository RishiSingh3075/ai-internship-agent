/*
  Warnings:

  - You are about to drop the column `parseResume` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "parseResume",
ADD COLUMN     "parseSkills" JSONB;
