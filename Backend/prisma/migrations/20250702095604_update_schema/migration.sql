/*
  Warnings:

  - You are about to drop the column `addressId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_addressId_fkey";

-- DropIndex
DROP INDEX "stores_addressId_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "addressId",
ADD COLUMN     "locationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "addressId",
ADD COLUMN     "locationId" INTEGER;

-- DropTable
DROP TABLE "addresses";

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subDistrict" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "biteship_area_id" TEXT,
    "userId" INTEGER,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_locationId_key" ON "stores"("locationId");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
