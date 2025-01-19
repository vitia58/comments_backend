import { Exclude, Type } from 'class-transformer';
import { IsString, IsEmail, IsUrl, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { CaptchaVerifyDto } from 'src/captcha/dto/captchaVerify.dto';
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

  @ValidateNested()
  @Type(() => CaptchaVerifyDto)
  captcha: CaptchaVerifyDto;

  @Exclude()
  topic: Types.ObjectId;
}
