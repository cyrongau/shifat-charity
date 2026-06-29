import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';
import { paginate } from '../common/helpers/pagination.helper';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: {
        careerId: dto.careerId,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        resumeUrl: dto.resumeUrl,
        coverLetter: dto.coverLetter,
        trackingCode: uuidv4(),
      },
    });
  }

  async findAll(query: FindApplicationsDto) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.careerId) where.careerId = query.careerId;
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { trackingCode: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return paginate(this.prisma.application, { where, include: { career: { select: { id: true, title: true } } }, orderBy: { createdAt: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.application.findUnique({
      where: { id },
      include: { career: true },
    });
    if (!item) throw new NotFoundException('Application not found');
    return item;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    await this.findOne(id);
    return this.prisma.application.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.application.delete({ where: { id } });
  }
}
