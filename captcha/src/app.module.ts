import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CaptchaModule } from './captcha/captcha.module';
import { FilesModule } from './files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get<string>('REDIS_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    CaptchaModule,
    FilesModule,
  ],
})
export class AppModule {}
