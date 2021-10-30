import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateBookmarkDTO } from './bookmark.dto';
import { Bookmark } from './bookmark.interface';
import { BookmarkService } from './bookmark.service';

interface BookmarkResponse<T = unknown> {
  code: number;
  data?: T;
  message: string;
}

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  async findAll(): Promise<BookmarkResponse<Bookmark[]>> {
    return {
      code: 200,
      data: await this.bookmarkService.findAll(),
      message: 'success',
    };
  }

  @Post()
  async addOne(@Body() body: CreateBookmarkDTO): Promise<BookmarkResponse> {
    await this.bookmarkService.addOne(body);
    return {
      code: 200,
      message: 'success',
    };
  }
}
