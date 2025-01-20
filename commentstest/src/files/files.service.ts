import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  BadRequestException,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
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
    try {
      const image = sharp(file.buffer);

      const metadata = await image.metadata();
      if (metadata.width > 320 || metadata.height > 240) {
        if (metadata.width / 320 > metadata.height / 240) {
          image.resize({ width: 320 });
        } else image.resize({ height: 240 });

        file.buffer = await image.toBuffer();
      }
    } catch (e) {
      throw new UnsupportedMediaTypeException('Invalid image');
    }
  }

  validateText(file: Express.Multer.File) {
    if (file.size > 1024 * 100) {
      throw new BadRequestException('File size should be less than 100KB');
    }
  }

  async uploadFile(file: Express.Multer.File) {
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

  async getSignedUrl(
    file: string,
    {
      verify = false,
      expiresIn = 3600,
    }: { verify?: boolean; expiresIn?: number } = {},
  ) {
    const get_command = new GetObjectCommand({
      Bucket: this.configService.get('s3_bucket'),
      Key: file,
      ResponseContentType: mime.lookup(file) as string,
    });

    const urlPromise = getSignedUrl(this.s3, get_command, { expiresIn });

    if (verify) {
      await this.s3
        .send(
          new HeadObjectCommand({
            Bucket: this.configService.get('s3_bucket'),
            Key: file,
          }),
        )
        .catch(() => {
          throw new BadRequestException('File not found');
        });
    }

    return urlPromise;
  }

  async deleteFile(file: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('s3_bucket'),
        Key: file,
      }),
    );
  }
}
