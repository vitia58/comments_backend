import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateMessageDto } from './dto/createComment.dto';
import { CACHE_MANAGER, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('comments')
export class CommentsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly commentsService: CommentsService,
  ) {}

  @Get(':topic')
  @CacheTTL(1)
  async findAll(
    @Param('topic') topic: string,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const dataFromCache = await this.cacheManager.get(
      `Topic-${topic}-${offset}-${limit}`,
    );
    if (dataFromCache) return dataFromCache;

    const data = await this.commentsService.findAll(topic, offset, limit);

    this.cacheManager.get<string[]>(`Topic-${topic}`).then(async (list) => {
      if (list?.includes(`${offset}-${limit}`)) {
        return;
      }

      await this.cacheManager.set(`Topic-${topic}`, [
        ...(list || []),
        `${offset}-${limit}`,
      ]);

      await this.cacheManager.set(
        `Topic-${topic}-${offset}-${limit}`,
        data,
        3000000,
      );
    });

    return data;
  }

  @Post()
  async create(@Body() comment: CreateMessageDto) {
    const newComment = await this.commentsService.create(comment);

    this.cacheManager
      .get<string[]>(`Topic-${newComment.topic}`)
      .then(async (list) => {
        if (!list) {
          return;
        }

        const topicList = list.map((key) => `Topic-${newComment.topic}-${key}`);
        topicList.push(`Topic-${newComment.topic}`);

        await this.cacheManager.mdel(topicList);
      });

    return newComment;
  }
}
