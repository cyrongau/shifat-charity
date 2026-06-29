-- CreateEnum
CREATE TYPE "EmailCampaignStatus" AS ENUM ('DRAFT', 'SENT', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "CampaignTargetType" AS ENUM ('ALL_SUBSCRIBERS', 'MAILING_LIST');

-- CreateTable
CREATE TABLE "mailing_lists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mailing_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailing_list_members" (
    "id" UUID NOT NULL,
    "mailing_list_id" UUID NOT NULL,
    "subscriber_id" UUID NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mailing_list_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "EmailCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "target_type" "CampaignTargetType" NOT NULL DEFAULT 'ALL_SUBSCRIBERS',
    "mailing_list_id" UUID,
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mailing_list_members_mailing_list_id_subscriber_id_key" ON "mailing_list_members"("mailing_list_id", "subscriber_id");

-- AddForeignKey
ALTER TABLE "mailing_list_members" ADD CONSTRAINT "mailing_list_members_mailing_list_id_fkey" FOREIGN KEY ("mailing_list_id") REFERENCES "mailing_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailing_list_members" ADD CONSTRAINT "mailing_list_members_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_mailing_list_id_fkey" FOREIGN KEY ("mailing_list_id") REFERENCES "mailing_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
