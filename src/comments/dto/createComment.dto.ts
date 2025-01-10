import { IsString, IsEmail, IsUrl } from 'class-validator';
import { Types } from 'mongoose';
import {
  MongoTransform,
  OptionalTransform,
} from 'src/common/helpers/transform.helpers';
import { IsValidHTML } from 'src/common/validators/isValidHtml';

export class CreateMessageDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @OptionalTransform()
  @IsUrl()
  homepage?: string;

  @IsString()
  @IsValidHTML()
  text: string;

  @OptionalTransform()
  @IsString()
  file?: string;

  @MongoTransform()
  parent?: Types.ObjectId;
}
