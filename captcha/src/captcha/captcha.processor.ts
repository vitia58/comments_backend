import { Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Job } from 'bull';
import { createHmac } from 'crypto';
import Redis from 'ioredis';
import { FilesService } from 'src/files/files.service';

@Injectable()
@Processor('captchas')
export class CaptchaProcessor {
  private readonly redisClient: Redis;

  constructor(
    private readonly filesService: FilesService,
    configService: ConfigService,
  ) {
    this.redisClient = new Redis(configService.get('REDIS_URI'));
  }

  @Process('create')
  async create() {
    const { data } = await axios.get<{ solution: string; image_url: string }>(
      'https://captcha-generator.p.rapidapi.com/',
      {
        params: {
          noise_number: '10',
          fontname: 'sora',
        },
        headers: {
          'x-rapidapi-key':
            '8279d30122msh0abb0255c34f280p1d0957jsn7eea988a2d65',
          'x-rapidapi-host': 'captcha-generator.p.rapidapi.com',
        },
      },
    );

    const key = await this.filesService.uploadFile(data.image_url);

    const result = {
      hash: this.generateHash(data.solution),
      key,
    };

    await this.redisClient.lpush('captchas', JSON.stringify(result));
  }

  @Process('delete')
  async delete(job: Job<{ key: string }>) {
    this.filesService.deleteFile(job.data.key);
  }

  generateHash(text: string) {
    return createHmac('sha1', 'secret')
      .update(text.toLocaleLowerCase())
      .digest('hex');
  }
}
