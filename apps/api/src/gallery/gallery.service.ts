import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';
import { FindGalleryItemsDto } from './dto/find-gallery-items.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGalleryItemDto) {
    return this.prisma.galleryItem.create({ data: dto as any });
  }

  async findAll(query: FindGalleryItemsDto): Promise<PaginatedResult<any>> {
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

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return paginate(this.prisma.galleryItem, { where, orderBy: { createdAt: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.galleryItem.findUnique({
      where: { id },
      include: { project: { select: { id: true, title: true } } },
    });
    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }

  async update(id: string, dto: UpdateGalleryItemDto) {
    await this.findOne(id);
    return this.prisma.galleryItem.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.galleryItem.delete({ where: { id } });
  }
}
