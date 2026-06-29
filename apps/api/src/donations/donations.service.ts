import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { FindDonationsDto } from './dto/find-donations.dto';
import { paginate } from '../common/helpers/pagination.helper';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDonationDto, userId?: string) {
    const receiptId = `SHF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const data: any = {
      amount: dto.amount,
      currency: dto.currency ?? 'USD',
      frequency: dto.frequency,
      designation: dto.designation,
      campaignId: dto.campaignId || null,
      donorName: dto.donorName || null,
      donorEmail: dto.donorEmail || null,
      paymentMethod: dto.paymentMethod,
      isAnonymous: dto.isAnonymous ?? false,
      receiptId,
      status: dto.paymentMethod === 'BANK_TRANSFER' ? 'PENDING' : 'COMPLETED',
      userId: userId ?? null,
    };

    if (dto.paymentMethod === 'BANK_TRANSFER') {
      data.transactionRef = `BT-${Date.now().toString(36).toUpperCase()}`;
      data.metadata = {
        bankTransferRef: data.transactionRef,
        bankName: 'Dahabshil Bank International',
        accountName: 'SHiFAT Charity Trust',
        accountNumber: '1234-5678-9012',
        swiftCode: 'DAHAXXXX',
      };
    }

    const donation = await this.prisma.donation.create({ data });

    if (dto.campaignId && dto.paymentMethod !== 'BANK_TRANSFER') {
      await this.updateCampaignProgress(dto.campaignId);
    }

    return donation;
  }

  async findByReceipt(receiptId: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { receiptId },
      include: { campaign: { select: { title: true } }, user: { select: { fullName: true, email: true } } },
    });
    if (!donation) throw new NotFoundException('Receipt not found');
    return donation;
  }

  async findAll(user: { id: string; role: string }, query: FindDonationsDto) {
    const where: any = {};
    if (user.role === 'DONOR') {
      where.userId = user.id;
    }
    if (query.status) where.status = query.status;
    if (query.paymentMethod) where.paymentMethod = query.paymentMethod;
    if (query.frequency) where.frequency = query.frequency;
    if (query.userId) where.userId = query.userId;
    if (query.search) {
      where.OR = [
        { designation: { contains: query.search, mode: 'insensitive' } },
        { receiptId: { contains: query.search, mode: 'insensitive' } },
        { transactionRef: { contains: query.search, mode: 'insensitive' } },
        { donorName: { contains: query.search, mode: 'insensitive' } },
        { donorEmail: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return paginate(
      this.prisma.donation,
      {
        where,
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          campaign: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      query,
    );
  }

  async findOne(id: string) {
    const item = await this.prisma.donation.findUnique({
      where: { id },
      include: { campaign: { select: { title: true } }, user: { select: { fullName: true, email: true } } },
    });
    if (!item) throw new NotFoundException('Donation not found');
    return item;
  }

  async update(id: string, dto: UpdateDonationDto) {
    await this.findOne(id);
    const donation = await this.prisma.donation.update({ where: { id }, data: dto as any });

    if (dto.campaignId) {
      await this.updateCampaignProgress(dto.campaignId);
    }

    return donation;
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.prisma.donation.delete({ where: { id } });

    if (item.campaignId) {
      await this.updateCampaignProgress(item.campaignId);
    }

    return item;
  }

  private async updateCampaignProgress(campaignId: string) {
    const agg = await this.prisma.donation.aggregate({
      where: { campaignId, status: 'COMPLETED' },
      _sum: { amount: true },
    });
    const total = agg._sum.amount ? Number(agg._sum.amount) : 0;

    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return;

    const target = Number(campaign.targetAmount);
    const progress = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0;

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { currentRaised: total, progressPercentage: progress },
    });
  }
}
