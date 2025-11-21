-- AlterTable
ALTER TABLE "products" ADD COLUMN     "childCategoryId" INTEGER,
ADD COLUMN     "parentCategoryId" INTEGER;

-- CreateIndex
CREATE INDEX "products_parentCategoryId_idx" ON "products"("parentCategoryId");

-- CreateIndex
CREATE INDEX "products_childCategoryId_idx" ON "products"("childCategoryId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_childCategoryId_fkey" FOREIGN KEY ("childCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
