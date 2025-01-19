import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CollectionEnum } from 'src/common/enums/CollectionEnum';

@Schema({ versionKey: false, collection: CollectionEnum.Comment })
export class Comment {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ required: false })
  homePage?: string;

  @Prop()
  text: string;

  @Prop({ type: SchemaTypes.ObjectId, required: false, index: true })
  topic: Types.ObjectId;

  @Prop({ required: false })
  file?: string;

  @Prop({ ref: Comment.name, required: false })
  parent?: Types.ObjectId;

  @Prop({ default: 0 })
  commentsCount: number;

  replies?: Comment[];

  @Prop({ default: Date.now, type: SchemaTypes.Number })
  date: number;
}

export type CommentDocument = Omit<Comment, 'children'> & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);

async function updateParentCounts(
  parentId: Types.ObjectId,
  count = 1,
): Promise<CommentDocument> {
  if (!parentId) return null;

  const parent = await (this as CommentDocument)
    .model('Comment')
    .findByIdAndUpdate<CommentDocument>(
      parentId,
      { $inc: { commentsCount: 1 } },
      { new: true },
    )
    .exec();

  return (await updateParentCounts.call(this, parent.parent, count)) ?? parent;
}

CommentSchema.pre<CommentDocument>('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  if (this.parent) {
    const parent = await updateParentCounts.call(this, this.parent, 1);
    this.topic = parent._id;
  }

  next();
});
