import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicEndpoint: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '5204';
    const accessKey = process.env.MINIO_ACCESS_KEY || 'shifat_minio_admin';
    const secretKey = process.env.MINIO_SECRET_KEY || 'shifat_minio_pass';
    this.bucket = process.env.MINIO_BUCKET || 'shifat-media';
    this.publicEndpoint = `http://${endpoint}:${port}/${this.bucket}`;

    this.client = new S3Client({
      endpoint: `http://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<{ url: string; objectKey: string }> {
    const ext = path.extname(originalName) || '';
    const objectKey = `brand/${uuid()}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    const url = `${this.publicEndpoint}/${objectKey}`;
    this.logger.log(`Uploaded ${objectKey} -> ${url}`);
    return { url, objectKey };
  }
}
