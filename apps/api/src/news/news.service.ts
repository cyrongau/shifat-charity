import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FindNewsDto } from './dto/find-news.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNewsDto, authorId: string) {
    return this.prisma.newsItem.create({ data: { ...dto, authorId } as any });
  }

  async findAll(query: FindNewsDto): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    }

    return paginate(
      this.prisma.newsItem,
      {
        where,
        include: { author: { select: { id: true, fullName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
      query,
    );
  }

  async findOne(id: string) {
    const item = await this.prisma.newsItem.findUnique({
      where: { id },
      include: { author: { select: { id: true, fullName: true, email: true } } },
    });
    if (!item) throw new NotFoundException('News item not found');
    return item;
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.findOne(id);
    return this.prisma.newsItem.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.newsItem.delete({ where: { id } });
  }
}
