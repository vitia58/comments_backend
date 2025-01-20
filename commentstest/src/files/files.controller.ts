import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadFilesDto } from './dto/upload-files.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const mimetype = file.mimetype;

    if (['image/jpeg', 'image/png', 'image/gif'].includes(mimetype)) {
      await this.service.validateImage(file);
    } else if (mimetype === 'text/plain') {
      this.service.validateText(file);
    } else {
      throw new BadRequestException('Unsupported file type');
    }

    return this.service.uploadFile(file);
  }

  @Get(':file')
  async getSignedUrl(@Param('file') file: string) {
    return this.service.getSignedUrl(file);
  }
}
