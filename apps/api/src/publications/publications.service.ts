import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FindPublicationsDto } from './dto/find-publications.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class PublicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePublicationDto) {
    return this.prisma.publication.create({ data: dto as any });
  }

  async findAll(query: FindPublicationsDto): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    }

    return paginate(this.prisma.publication, { where, orderBy: { publicationDate: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.publication.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Publication not found');
    return item;
  }

  async update(id: string, dto: UpdatePublicationDto) {
    await this.findOne(id);
    return this.prisma.publication.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.publication.delete({ where: { id } });
  }
}
