import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { bookmarkSchema } from './bookmark.schema';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bookmarks', schema: bookmarkSchema }]),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
