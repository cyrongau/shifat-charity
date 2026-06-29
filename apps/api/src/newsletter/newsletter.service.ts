import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { FindNewsletterDto } from './dto/find-newsletter.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(dto: CreateNewsletterDto) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      if (!existing.isActive) {
        return this.prisma.newsletterSubscriber.update({
          where: { email: dto.email },
          data: { isActive: true, unsubscribed: null },
        });
      }
      throw new ConflictException('Email is already subscribed');
    }
    return this.prisma.newsletterSubscriber.create({ data: dto });
  }

  async findAll(query: FindNewsletterDto) {
    const where: any = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return paginate(this.prisma.newsletterSubscriber, { where, orderBy: { subscribedAt: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Subscriber not found');
    return item;
  }

  async toggleActive(id: string) {
    const item = await this.findOne(id);
    return this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive: !item.isActive },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.newsletterSubscriber.delete({ where: { id } });
  }

  async exportCsv() {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' },
    });

    const headers = 'Email,Subscribed At,Status\n';
    const rows = subscribers
      .map((s) => `"${s.email}","${s.subscribedAt.toISOString()}",${s.isActive ? 'Active' : 'Inactive'}`)
      .join('\n');

    return headers + rows;
  }
}
