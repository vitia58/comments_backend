import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/models/comments.model';
import { TopicPipelines } from './topics.pipelines';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TopicsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async list() {
    console.log('Fetching topics list');
    return this.commentModel.aggregate<
      Pick<Comment, '_id' | 'name' | 'email' | 'text' | 'date'>
    >(TopicPipelines.getCommentHeadPipeline());
  }

  @OnEvent('topic.created')
  updateCache() {
    this.cacheManager.del('topicsList');
  }
}
