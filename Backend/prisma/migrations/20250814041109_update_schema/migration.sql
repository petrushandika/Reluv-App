/*
  Warnings:

  - Added the required column `name` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_profiles" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
