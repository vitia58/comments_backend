import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class FilesService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(url: string) {
    const file = await fetch(url).then((res) => res.buffer());
    const Key = new URL(url).pathname.split('/').pop();

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.configService.get('s3_bucket'),
        Key,
        Body: file,
      }),
    );

    return Key;
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
