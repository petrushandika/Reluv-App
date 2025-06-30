/*
  Warnings:

  - You are about to drop the column `recipientName` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `banner` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `stores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipient` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "recipientName",
ADD COLUMN     "recipient" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "storeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "banner",
DROP COLUMN "description",
DROP COLUMN "logo";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_storeId_key" ON "profiles"("storeId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
