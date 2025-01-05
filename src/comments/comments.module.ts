import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionsImport } from 'src/common/enums/CollectionsImportEnum';

@Module({
  imports: [MongooseModule.forFeature([CollectionsImport.Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
