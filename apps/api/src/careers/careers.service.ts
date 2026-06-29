import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCareerOpportunityDto } from './dto/create-career-opportunity.dto';
import { UpdateCareerOpportunityDto } from './dto/update-career-opportunity.dto';
import { FindCareersDto } from './dto/find-careers.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class CareersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCareerOpportunityDto) {
    return this.prisma.careerOpportunity.create({ data: dto as any });
  }

  async findAll(query: FindCareersDto): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { department: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.department) {
      where.department = query.department;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return paginate(this.prisma.careerOpportunity, { where, orderBy: { createdAt: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.careerOpportunity.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Career opportunity not found');
    return item;
  }

  async update(id: string, dto: UpdateCareerOpportunityDto) {
    await this.findOne(id);
    return this.prisma.careerOpportunity.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.careerOpportunity.delete({ where: { id } });
  }
}
