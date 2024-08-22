import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { OnlyMaxRole } from 'src/constants';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @OnlyMaxRole()
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    const user: RequestUser = req.user;
    return this.articleService.create(createArticleDto, user.userId);
  }

  @Get()
  findAll(@Request() req) {
    const role: UserRole = req.role;
    const isMax = role === UserRole.MAX;
    return this.articleService.findAll(isMax);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @OnlyMaxRole()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @OnlyMaxRole()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
