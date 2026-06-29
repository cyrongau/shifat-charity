import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const existing = await this.prisma.siteSettings.findFirst();
    if (existing) return existing;
    return this.prisma.siteSettings.create({
      data: {
        siteName: 'Shifat Foundation',
        siteDescription: 'A non-profit organization dedicated to making a difference.',
        contactEmail: 'info@shifat.org',
      },
    });
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const existing = await this.prisma.siteSettings.findFirst();
    if (existing) {
      return this.prisma.siteSettings.update({
        where: { id: existing.id },
        data: dto as any,
      });
    }
    return this.prisma.siteSettings.create({
      data: {
        siteName: 'Shifat Foundation',
        siteDescription: 'A non-profit organization dedicated to making a difference.',
        contactEmail: 'info@shifat.org',
        ...dto,
      } as any,
    });
  }
}
