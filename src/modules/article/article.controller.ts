import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { Article } from '@prisma/client';
import { ArticleEntity, ArticlePreviewEntity } from './entity/article.entity';
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
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req,
  ): Promise<Article> {
    const user: RequestUser = req.user;
    return this.articleService.create(createArticleDto, user.userId);
  }

  @Public()
  @Get('/published')
  @ApiOkResponse({ type: ArticlePreviewEntity, isArray: true })
  async findPublish(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ): Promise<PageData<ArticlePreviewEntity>> {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);

    const { list, total } = await this.articleService.findAll({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
      where: { isPublished: true },
    });

    return {
      list: list.map((item) => new ArticlePreviewEntity(item)),
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    };
  }

  @OnlyMaxRole()
  @Get()
  @ApiOkResponse({ type: ArticlePreviewEntity, isArray: true })
  async findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ): Promise<PageData<ArticlePreviewEntity>> {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);

    const { list, total } = await this.articleService.findAll({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    });

    return {
      list: list.map((item) => new ArticlePreviewEntity(item)),
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    };
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id') id: string): Promise<Article | null> {
    return this.articleService.findOne(id);
  }

  @OnlyMaxRole()
  @Post(':id')
  @ApiBody({ type: UpdateArticleDto })
  @ApiOkResponse({ type: ArticleEntity })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.update(id, updateArticleDto);
  }

  @OnlyMaxRole()
  @Put(':id')
  @ApiBody({ type: UpdatePublishDto })
  @ApiOkResponse({ type: ArticleEntity })
  async changePublish(
    @Param('id') id: string,
    @Body() data: UpdatePublishDto,
  ): Promise<Article> {
    return this.articleService.changePublish(id, data.isPublished);
  }

  @OnlyMaxRole()
  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id') id: string): Promise<Article> {
    return this.articleService.remove(id);
  }
}
