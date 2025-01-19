import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CaptchaService } from './captcha.service';

@Controller()
export class CaptchaController {
  constructor(private readonly service: CaptchaService) {}

  @MessagePattern('get_captcha')
  async create() {
    return this.service.getNext();
  }
}
