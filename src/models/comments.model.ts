import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
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

  @Prop({ required: false })
  file?: string;

  @Prop({ ref: Comment.name, required: false })
  parent?: Types.ObjectId;

  @Prop()
  commentsCount: number;

  children?: Comment[];
  level?: number;

  @Prop()
  createdAt: Date;
}

export type CommentDocument = Omit<Comment, 'children'> & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.pre<CommentDocument>('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  next();
});
