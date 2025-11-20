/*
  Warnings:

  - You are about to drop the column `birth` on the `user_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "birth";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birth" TIMESTAMP(3);
