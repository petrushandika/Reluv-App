-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "editCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "orderId" INTEGER,
ADD COLUMN     "reply" TEXT,
ADD COLUMN     "replyAuthorId" INTEGER;

-- CreateIndex
CREATE INDEX "reviews_orderId_idx" ON "reviews"("orderId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_replyAuthorId_fkey" FOREIGN KEY ("replyAuthorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
