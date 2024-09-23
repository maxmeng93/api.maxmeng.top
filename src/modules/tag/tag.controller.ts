import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Prisma, Tag } from '@prisma/client';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: Prisma.TagCreateInput) {
    return this.tagService.createTag(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.tags({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.tag({ id: Number(id) });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: Prisma.TagUpdateInput) {
    return this.tagService.updateTag({
      where: { id: Number(id) },
      data: updateTagDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.deleteTag({ id: Number(id) });
  }
}
