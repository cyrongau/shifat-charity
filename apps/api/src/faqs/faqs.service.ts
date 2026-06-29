import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FindFaqsDto } from './dto/find-faqs.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class FaqsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFaqDto) {
    return this.prisma.faq.create({ data: dto as any });
  }

  async findAll(query: FindFaqsDto): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { question: { contains: query.search, mode: 'insensitive' } },
        { answer: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return paginate(this.prisma.faq, { where, orderBy: { sortOrder: 'asc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.faq.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('FAQ not found');
    return item;
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.findOne(id);
    return this.prisma.faq.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.faq.delete({ where: { id } });
  }
}
