import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('topics')
@UseInterceptors(CacheInterceptor)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @CacheKey('topicsList')
  async getTopics() {
    return this.topicsService.list();
  }
}
