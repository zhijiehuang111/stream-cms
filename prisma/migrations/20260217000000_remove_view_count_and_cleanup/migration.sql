-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT IF EXISTS "Video_categoryId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN IF EXISTS "categoryId",
DROP COLUMN IF EXISTS "featured",
DROP COLUMN IF EXISTS "tags",
DROP COLUMN IF EXISTS "viewCount";

-- DropTable
DROP TABLE IF EXISTS "Category";
