import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FindCampaignsDto } from './dto/find-campaigns.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCampaignDto) {
    return this.prisma.campaign.create({ data: dto as any });
  }

  async findAll(query: FindCampaignsDto): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.region) {
      where.region = query.region;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return paginate(this.prisma.campaign, { where, orderBy: { createdAt: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.campaign.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Campaign not found');
    return item;
  }

  async update(id: string, dto: UpdateCampaignDto) {
    await this.findOne(id);
    return this.prisma.campaign.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.campaign.delete({ where: { id } });
  }
}
