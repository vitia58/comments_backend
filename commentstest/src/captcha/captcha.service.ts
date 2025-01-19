import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHmac } from 'crypto';
import { CaptchaVerifyDto } from './dto/captchaVerify.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CaptchaService {
  constructor(@Inject('CAPTCHA_SERVICE') private client: ClientProxy) {}

  create() {
    return this.client.send('get_captcha', {});
  }

  verify(data: CaptchaVerifyDto) {
    return this.generateHash(data.text) === data.hash;
  }

  generateHash(text: string) {
    return createHmac('sha1', 'secret')
      .update(text.toLocaleLowerCase())
      .digest('hex');
  }
}
