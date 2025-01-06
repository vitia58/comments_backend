import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/models/comments.model';
import { CreateMessageDto } from './dto/createComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async findAll(topic: string) {
    const buildTree = (replies: Comment[]) => {
      const roots: Comment[] = [];
      const replyMap = new Map();
      replies.forEach((comment) => {
        replyMap.set(comment._id.toString(), comment);
      });

      replies.forEach((comment) => {
        if (!comment.parent) return roots.push(comment);
        const parent = replyMap.get(comment.parent.toString());
        if (parent) {
          parent.replies ??= [];
          parent.replies.push(comment);
        }
      });
      return roots;
    };

    const comments = await this.commentModel.find({ topic }, null, {
      sort: { _id: -1 },
    });
    return buildTree(comments.map((comment) => comment.toObject()));
  }

  async create(comment: CreateMessageDto) {
    return this.commentModel.create(comment);
  }
}
