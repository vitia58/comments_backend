import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateMessageDto } from './dto/createComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':topic')
  async findAll(@Param('topic') topic: string) {
    return this.commentsService.findAll(topic);
  }

  @Post()
  async create(@Body() comment: CreateMessageDto) {
    return this.commentsService.create(comment);
  }
}
