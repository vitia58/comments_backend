import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/models/comments.model';
import { TopicPipelines } from './topics.pipelines';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async list() {
    return this.commentModel.aggregate<
      Pick<Comment, '_id' | 'name' | 'email' | 'text' | 'date'>
    >(TopicPipelines.getCommentHeadPipeline());
  }
}
