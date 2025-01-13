import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import * as sharp from 'sharp';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {}

  async validateImage(file: Express.Multer.File) {
    const image = sharp(file.buffer);

    const metadata = await image.metadata();
    if (metadata.width > 320 || metadata.height > 240) {
      if (metadata.width / 320 > metadata.height / 240) {
        image.resize({ width: 320 });
      } else image.resize({ height: 240 });

      file.buffer = await image.toBuffer();
    }
  }

  validateText(file: Express.Multer.File) {
    if (file.size > 1024 * 100) {
      throw new BadRequestException('File size should be less than 100KB');
    }
  }

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileName = file.originalname.replace(/^[^.]*/, Date.now().toString());

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.configService.get('s3_bucket'),
        Key: fileName,
        Body: file.buffer,
      }),
    );

    return fileName;
  }

  async getSignedUrl(file: string) {
    const get_command = new GetObjectCommand({
      Bucket: this.configService.get('s3_bucket'),
      Key: file,
      ResponseContentType: mime.lookup(file) as string,
    });

    const url = await getSignedUrl(this.s3, get_command, { expiresIn: 3600 });
    return url;
  }
}
