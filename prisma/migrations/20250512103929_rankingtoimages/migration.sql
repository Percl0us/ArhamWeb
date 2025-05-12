/*
  Warnings:

  - Added the required column `rank` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "rank" INTEGER NOT NULL;
