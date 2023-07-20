import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateBookmarkDTO, CreateBookmarkTreeDTO } from './bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.entity';

@ApiTags('bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('list')
  async findAll(): Promise<Bookmark[]> {
    return await this.bookmarkService.findAll();
  }

  @Post('add')
  async addOne(@Body() body: CreateBookmarkDTO): Promise<Bookmark> {
    return await this.bookmarkService.addOne(body);
  }

  @ApiBody({ type: [CreateBookmarkTreeDTO] })
  @Post('saveTree')
  async saveTree(@Body() body: CreateBookmarkTreeDTO[]): Promise<Bookmark[]> {
    const result = [];
    for (const tree of body) {
      const savedTree = await this.bookmarkService.saveTree(tree);
      result.push(savedTree);
    }
    return result;
  }
}
