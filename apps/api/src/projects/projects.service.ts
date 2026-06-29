import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindProjectsDto } from './dto/find-projects.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto as any });
  }

  async findAll(query: FindProjectsDto): Promise<PaginatedResult<any>> {
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

    if (query.programId) {
      where.programId = query.programId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return paginate(
      this.prisma.project,
      {
        where,
        include: { program: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      },
      query,
    );
  }

  async findOne(id: string) {
    const item = await this.prisma.project.findUnique({
      where: { id },
      include: { program: { select: { id: true, title: true, slug: true } } },
    });
    if (!item) throw new NotFoundException('Project not found');
    return item;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }
}
