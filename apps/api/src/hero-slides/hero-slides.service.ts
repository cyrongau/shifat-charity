import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';
import { FindHeroSlidesDto } from './dto/find-hero-slides.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class HeroSlidesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateHeroSlideDto) {
    return this.prisma.heroSlide.create({ data: dto as any });
  }

  findAll(query: FindHeroSlidesDto) {
    const where: any = {};
    if (query.pageKey) where.page = query.pageKey;
    return paginate(
      this.prisma.heroSlide,
      { where, orderBy: { sortOrder: 'asc' } },
      query,
    );
  }

  async findOne(id: string) {
    const item = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Hero slide not found');
    return item;
  }

  async update(id: string, dto: UpdateHeroSlideDto) {
    await this.findOne(id);
    return this.prisma.heroSlide.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.heroSlide.delete({ where: { id } });
  }
}
