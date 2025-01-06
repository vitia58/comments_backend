import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateMessageDto } from './dto/createComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':topic')
  async findAll(
    @Param('topic') topic: string,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.commentsService.findAll(topic, offset, limit);
  }

  @Post()
  async create(@Body() comment: CreateMessageDto) {
    return this.commentsService.create(comment);
  }
}
