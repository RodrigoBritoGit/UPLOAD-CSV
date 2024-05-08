-- CreateTable
CREATE TABLE "excel_items" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "price" DECIMAL(18,6) NOT NULL,
    "total_price" DECIMAL(18,6) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "excel_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "excel_items_code_key" ON "excel_items"("code");
