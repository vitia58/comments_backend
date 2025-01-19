import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/models/comments.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
