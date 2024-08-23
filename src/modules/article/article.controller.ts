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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UserRole, Article } from '@prisma/client';
import { ArticleEntity } from './entity/article.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdatePublishDto } from './dto/update-article.dto';
import { OnlyMaxRole, Public } from 'src/constants';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @OnlyMaxRole()
  @Post()
  @ApiBody({ type: CreateArticleDto })
  @ApiCreatedResponse({ type: ArticleEntity })
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req,
  ): Promise<Article> {
    const user: RequestUser = req.user;
    return this.articleService.create(createArticleDto, user.userId);
  }

  @Public()
  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  findAll(@Request() req): Promise<Article[]> {
    const role: UserRole = req.role;
    const isMax = role === UserRole.MAX;
    return this.articleService.findAll(isMax);
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  findOne(@Param('id') id: string): Promise<Article | null> {
    return this.articleService.findOne(id);
  }

  @OnlyMaxRole()
  @Post(':id')
  @ApiBody({ type: UpdateArticleDto })
  @ApiOkResponse({ type: ArticleEntity })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.update(id, updateArticleDto);
  }

  @OnlyMaxRole()
  @Put(':id')
  @ApiBody({ type: UpdatePublishDto })
  @ApiOkResponse({ type: ArticleEntity })
  changePublish(
    @Param('id') id: string,
    @Body() data: UpdatePublishDto,
  ): Promise<Article> {
    return this.articleService.changePublish(id, data.isPublished);
  }

  @OnlyMaxRole()
  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  remove(@Param('id') id: string): Promise<Article> {
    return this.articleService.remove(id);
  }
}
