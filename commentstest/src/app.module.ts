import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './comments/comments.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FilesModule } from './files/files.module';
import { CaptchaModule } from './captcha/captcha.module';
import { TopicsModule } from './topics/topics.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RABBITMQ_URI')],
              queue: configService.get<string>('RABBITMQ_QUEUE'),
              queueOptions: {
                durable: false,
              },
            },
          }),
          inject: [ConfigService],
          name: 'CAPTCHA_SERVICE',
        },
      ],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        stores: [new KeyvRedis(configService.get<string>('REDIS_URI'))],
        namespace: 'cache',
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    CommentsModule,
    SocketModule,
    FilesModule,
    CaptchaModule,
    TopicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
