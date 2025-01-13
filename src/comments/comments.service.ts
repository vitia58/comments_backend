import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/models/comments.model';
import { CreateMessageDto } from './dto/createComment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly emitter: EventEmitter2,
    private readonly filesService: FilesService,
  ) {}

  async findAll(topic: string, offset: number, limit: number) {
    console.time('find');

    const comments = await this.commentModel.find({ topic }, null, {
      sort: { _id: -1 },
    });
    console.timeLog('find');

    const replies = comments.map((comment) => comment.toObject());
    let root: Comment = null;
    const replyMap = new Map();

    const promise = Promise.all(
      replies.map(async (comment) => {
        replyMap.set(comment._id.toString(), comment);
        if (comment.file) {
          comment.file = await this.filesService.getSignedUrl(comment.file);
        }
      }),
    );

    replies.forEach((comment) => {
      if (!comment.parent) return (root = comment);
      const parent = replyMap.get(comment.parent.toString());
      if (parent) {
        parent.replies ??= [];
        parent.replies.push(comment);
      }
    });
    console.timeLog('find');

    let index = 0;

    const traverse = (comment: Comment) => {
      index++;
      if (index > limit + offset) return false;

      if (index + comment.commentsCount < offset) {
        index += comment.commentsCount;
        comment.replies = [];
      } else if (index <= limit + offset) {
        comment.replies = (comment.replies ?? []).filter(traverse);
        return index > offset;
      } else {
        comment.replies = [];
      }
      return false;
    };
    traverse(root);
    console.timeEnd('find');
    await promise;

    return root;
  }

  async create(comment: CreateMessageDto) {
    const newComment = await this.commentModel.create(comment);
    this.emitter.emit('comment.created', newComment);
    return newComment;
  }
}
