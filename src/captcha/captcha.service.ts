import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHmac } from 'crypto';
import { CaptchaVerifyDto } from './dto/captchaVerify.dto';

@Injectable()
export class CaptchaService {
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

    const result = {
      hash: this.generateHash(data.solution),
      image: data.image_url,
    };
    console.log(data.solution.toLocaleLowerCase());

    return result;
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
