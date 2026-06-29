import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmailCampaignDto } from './dto/create-email-campaign.dto';
import { UpdateEmailCampaignDto } from './dto/update-email-campaign.dto';
import { FindEmailCampaignsDto } from './dto/find-email-campaigns.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class EmailCampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmailCampaignDto) {
    const data: any = {
      subject: dto.subject,
      content: dto.content,
      targetType: dto.targetType ?? 'ALL_SUBSCRIBERS',
    };
    if (dto.mailingListId) data.mailingListId = dto.mailingListId;
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    return this.prisma.emailCampaign.create({ data });
  }

  async findAll(query: FindEmailCampaignsDto) {
    const where: any = {};
    if (query.search) {
      where.OR = [{ subject: { contains: query.search, mode: 'insensitive' } }];
    }
    if (query.status) {
      where.status = query.status;
    }
    return paginate(this.prisma.emailCampaign, {
      where,
      include: { mailingList: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.emailCampaign.findUnique({
      where: { id },
      include: { mailingList: { select: { id: true, name: true } } },
    });
    if (!item) throw new NotFoundException('Email campaign not found');
    return item;
  }

  async update(id: string, dto: UpdateEmailCampaignDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    return this.prisma.emailCampaign.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.emailCampaign.delete({ where: { id } });
  }

  async send(id: string) {
    const campaign = await this.findOne(id);
    if (campaign.status === 'SENT') {
      throw new BadRequestException('Campaign has already been sent');
    }

    let recipients: string[] = [];
    if (campaign.targetType === 'ALL_SUBSCRIBERS') {
      const subs = await this.prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { email: true },
      });
      recipients = subs.map((s) => s.email);
    } else if (campaign.mailingListId) {
      const members = await this.prisma.mailingListMember.findMany({
        where: {
          mailingListId: campaign.mailingListId,
          subscriber: { isActive: true },
        },
        include: { subscriber: { select: { email: true } } },
      });
      recipients = members.map((m) => m.subscriber.email);
    }

    // TODO: Integrate with actual email sending service (SMTP/Mailpit)
    // For now, we mark as sent and log recipient count
    console.log(`[EmailCampaign] Sending "${campaign.subject}" to ${recipients.length} recipients`);

    return this.prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });
  }
}
