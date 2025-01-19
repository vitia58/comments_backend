import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaVerifyDto } from './dto/captchaVerify.dto';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly service: CaptchaService) {}

  @Get()
  async create() {
    return this.service.create();
  }

  @Get('verify')
  async verify(@Query() data: CaptchaVerifyDto) {
    return this.service.verify(data);
  }
}
