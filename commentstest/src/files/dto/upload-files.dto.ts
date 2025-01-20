import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFilesDto {
  @ApiProperty({ description: 'File', type: 'string', format: 'binary' })
  readonly file: Express.Multer.File;
}
