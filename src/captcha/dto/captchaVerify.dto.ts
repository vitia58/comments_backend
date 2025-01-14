import { IsString } from 'class-validator';

export class CaptchaVerifyDto {
  @IsString()
  hash: string;

  @IsString()
  text: string;
}
