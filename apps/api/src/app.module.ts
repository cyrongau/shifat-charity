import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { ProjectsModule } from './projects/projects.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { NewsModule } from './news/news.module';
import { PublicationsModule } from './publications/publications.module';
import { TeamModule } from './team/team.module';
import { CareersModule } from './careers/careers.module';
import { PartnersModule } from './partners/partners.module';
import { DonationsModule } from './donations/donations.module';
import { ApplicationsModule } from './applications/applications.module';
import { ContactsModule } from './contacts/contacts.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { FaqsModule } from './faqs/faqs.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { GalleryModule } from './gallery/gallery.module';
import { MailingListsModule } from './mailing-lists/mailing-lists.module';
import { EmailCampaignsModule } from './email-campaigns/email-campaigns.module';
import { MediaModule } from './media/media.module';
import { SearchModule } from './search/search.module';
import { SettingsModule } from './settings/settings.module';
import { StorageModule } from './storage/storage.module';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';

@Module({
  imports: [
    StorageModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProgramsModule,
    ProjectsModule,
    CampaignsModule,
    NewsModule,
    PublicationsModule,
    TeamModule,
    CareersModule,
    PartnersModule,
    DonationsModule,
    ApplicationsModule,
    ContactsModule,
    NewsletterModule,
    FaqsModule,
    AnnouncementsModule,
    GalleryModule,
    MailingListsModule,
    EmailCampaignsModule,
    MediaModule,
    SearchModule,
    SettingsModule,
    HeroSlidesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
