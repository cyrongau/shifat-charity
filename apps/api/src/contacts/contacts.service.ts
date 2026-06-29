import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FindContactsDto } from './dto/find-contacts.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contactSubmission.create({ data: dto });
  }

  async findAll(query: FindContactsDto) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return paginate(this.prisma.contactSubmission, { where, orderBy: { createdAt: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.contactSubmission.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Contact submission not found');
    return item;
  }

  async update(id: string, dto: UpdateContactDto) {
    await this.findOne(id);
    return this.prisma.contactSubmission.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contactSubmission.delete({ where: { id } });
  }
}
