import { Controller, Get } from '@nestjs/common';

@Controller('comments')
export class CommentsController {
  constructor() {}

  @Get()
  async getComments() {
    return [];
  }
}
