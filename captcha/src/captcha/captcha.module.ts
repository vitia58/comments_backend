import { Module } from '@nestjs/common';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';
import { BullModule } from '@nestjs/bull';
import { FilesModule } from 'src/files/files.module';
import { CaptchaProcessor } from './captcha.processor';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'captchas',
    }),
    ConfigModule,
    FilesModule,
  ],
  controllers: [CaptchaController],
  providers: [CaptchaService, CaptchaProcessor],
})
export class CaptchaModule {}
