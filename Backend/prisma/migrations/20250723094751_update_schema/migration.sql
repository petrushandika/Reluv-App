/*
  Warnings:

  - You are about to drop the column `image` on the `variants` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `variants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "variants" DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "size" TEXT;
