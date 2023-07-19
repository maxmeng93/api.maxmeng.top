import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBookmarkDTO } from './bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { BookmarkDTO } from './bookmark.dto';
import { Bookmark } from './bookmark.entity';

interface BookmarkResponse<T = unknown> {
  code: number;
  data?: T;
  message: string;
}

@ApiTags('bookmark')
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
