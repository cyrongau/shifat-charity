import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FindMediaDto } from './dto/find-media.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  create(dto: CreateMediaDto) {
    return this.prisma.mediaFile.create({ data: dto as any });
  }

  async upload(dto: UploadMediaDto, userId: string) {
    let base64Data = dto.data;
    const commaIdx = base64Data.indexOf(',');
    if (commaIdx !== -1) {
      base64Data = base64Data.slice(commaIdx + 1);
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
    } catch {
      throw new BadRequestException('Invalid base64 data');
    }

    if (buffer.length > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    const { url, objectKey } = await this.storage.uploadFile(
      buffer,
      dto.filename,
      dto.mimeType,
    );

    return this.prisma.mediaFile.create({
      data: {
        filename: objectKey.split('/').pop() || dto.filename,
        originalName: dto.filename,
        mimeType: dto.mimeType,
        fileSize: buffer.length,
        bucket: process.env.MINIO_BUCKET || 'shifat-media',
        objectKey,
        url,
        uploadedById: userId,
      },
    });
  }

  findAll(query: FindMediaDto) {
    const where: any = {};
    if (query.bucket) where.bucket = query.bucket;
    if (query.mimeType) where.mimeType = query.mimeType;
    if (query.search) {
      where.OR = [
        { filename: { contains: query.search, mode: 'insensitive' } },
        { originalName: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return paginate(this.prisma.mediaFile, { where, include: { uploadedBy: { select: { id: true, fullName: true } } }, orderBy: { createdAt: 'desc' } }, query);
  }

  async findOne(id: string) {
    const item = await this.prisma.mediaFile.findUnique({
      where: { id },
      include: { uploadedBy: { select: { id: true, fullName: true } } },
    });
    if (!item) throw new NotFoundException('Media file not found');
    return item;
  }

  async update(id: string, dto: UpdateMediaDto) {
    await this.findOne(id);
    return this.prisma.mediaFile.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.mediaFile.delete({ where: { id } });
  }
}
