/*
  Warnings:

  - You are about to alter the column `height` on the `variants` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `length` on the `variants` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `weight` on the `variants` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `width` on the `variants` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `height` on table `variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `length` on table `variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `variants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "variants" ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "height" SET DATA TYPE INTEGER,
ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "length" SET DATA TYPE INTEGER,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "weight" SET DATA TYPE INTEGER,
ALTER COLUMN "width" SET NOT NULL,
ALTER COLUMN "width" SET DATA TYPE INTEGER;
