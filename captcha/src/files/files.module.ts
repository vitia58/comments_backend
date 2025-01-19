import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { FilesService } from './files.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    S3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        config: {
          endpoint: configService.get('s3_url'),
          credentials: {
            accessKeyId: configService.get('s3_accessKeyId'),
            secretAccessKey: configService.get('s3_secretAccess'),
          },
          region: configService.get('s3_region'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
