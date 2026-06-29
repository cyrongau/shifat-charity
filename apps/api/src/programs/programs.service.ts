import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { FindProgramsDto } from './dto/find-programs.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProgramDto) {
    return this.prisma.program.create({ data: dto as any });
  }

  async findAll(query: FindProgramsDto): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return paginate(this.prisma.program, { where, orderBy: { sortOrder: 'asc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.program.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Program not found');
    return item;
  }

  async update(id: string, dto: UpdateProgramDto) {
    await this.findOne(id);
    return this.prisma.program.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.program.delete({ where: { id } });
  }
}
