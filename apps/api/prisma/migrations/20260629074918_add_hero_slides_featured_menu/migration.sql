-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "featured_order" INTEGER;

-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "featured_program_id" TEXT;

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" UUID NOT NULL,
    "page" TEXT NOT NULL DEFAULT 'home',
    "image_url" TEXT NOT NULL,
    "tagline" TEXT,
    "title" TEXT,
    "description" TEXT,
    "cta_text" TEXT,
    "cta_link" TEXT,
    "secondary_cta_text" TEXT,
    "secondary_cta_link" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);
