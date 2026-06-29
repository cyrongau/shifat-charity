import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMailingListDto } from './dto/create-mailing-list.dto';
import { UpdateMailingListDto } from './dto/update-mailing-list.dto';
import { FindMailingListsDto } from './dto/find-mailing-lists.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class MailingListsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMailingListDto) {
    return this.prisma.mailingList.create({ data: dto as any });
  }

  async findAll(query: FindMailingListsDto) {
    const where: any = {};
    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }];
    }
    return paginate(this.prisma.mailingList, {
      where,
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: 'desc' },
    }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.mailingList.findUnique({
      where: { id },
      include: {
        members: {
          include: { subscriber: { select: { id: true, email: true, isActive: true, subscribedAt: true } } },
          orderBy: { addedAt: 'desc' },
        },
        _count: { select: { members: true } },
      },
    });
    if (!item) throw new NotFoundException('Mailing list not found');
    return item;
  }

  async update(id: string, dto: UpdateMailingListDto) {
    await this.findOne(id);
    return this.prisma.mailingList.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.mailingList.delete({ where: { id } });
  }

  async addSubscriber(listId: string, subscriberId: string) {
    await this.findOne(listId);
    return this.prisma.mailingListMember.create({
      data: { mailingListId: listId, subscriberId },
    });
  }

  async removeSubscriber(listId: string, memberId: string) {
    const member = await this.prisma.mailingListMember.findUnique({ where: { id: memberId } });
    if (!member || member.mailingListId !== listId) throw new NotFoundException('Member not found');
    return this.prisma.mailingListMember.delete({ where: { id: memberId } });
  }
}
