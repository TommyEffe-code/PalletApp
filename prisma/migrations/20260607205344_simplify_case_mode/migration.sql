-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barcode" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isCase" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "palletId" TEXT NOT NULL,
    CONSTRAINT "ProductEntry_palletId_fkey" FOREIGN KEY ("palletId") REFERENCES "Pallet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductEntry" ("barcode", "createdAt", "id", "imageUrl", "name", "palletId", "quantity") SELECT "barcode", "createdAt", "id", "imageUrl", "name", "palletId", "quantity" FROM "ProductEntry";
DROP TABLE "ProductEntry";
ALTER TABLE "new_ProductEntry" RENAME TO "ProductEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
