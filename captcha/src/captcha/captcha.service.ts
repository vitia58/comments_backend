import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { createHmac } from 'crypto';
import Redis from 'ioredis';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class CaptchaService {
  private readonly redisClient: Redis;

  constructor(
    private readonly filesService: FilesService,
    @InjectQueue('captchas') private captchaQueue: Queue,
    configService: ConfigService,
  ) {
    this.redisClient = new Redis(configService.get('REDIS_URI'));
    this.redisClient.llen('captchas').then((size) => {
      Array.from({ length: 10 - size }).forEach(
        this.captchaQueue.add.bind(this.captchaQueue, 'create', {}),
      );
    });
  }

  async getNext() {
    await this.captchaQueue.add('create', {});

    const nextEntry = await this.redisClient.brpop('captchas', 0);

    const { hash, solution, key } = JSON.parse(nextEntry[1]) as {
      hash: string;
      solution: string;
      key: string;
    };

    const image = await this.filesService.getSignedUrl(key, { expiresIn: 60 });

    await this.captchaQueue.add('delete', { key }, { delay: 60000 });

    return { hash, solution, image };
  }

  generateHash(text: string) {
    return createHmac('sha1', 'secret')
      .update(text.toLocaleLowerCase())
      .digest('hex');
  }
}
