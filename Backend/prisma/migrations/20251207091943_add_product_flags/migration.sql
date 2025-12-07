-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false;
