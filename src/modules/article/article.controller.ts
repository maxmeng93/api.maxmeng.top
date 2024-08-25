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
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { Article } from '@prisma/client';
import { ArticleEntity, ArticleSummaryEntity } from './entity/article.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdatePublishDto } from './dto/update-article.dto';
import { OnlyMaxRole, Public } from 'src/constants';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '新增文章' })
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

  @ApiOperation({ summary: '获取已发布文章列表' })
  @Public()
  @Get('/published')
  @ApiOkResponse({ type: ArticleSummaryEntity, isArray: true })
  async findPublish(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ): Promise<PageData<ArticleSummaryEntity>> {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);

    const { list, total } = await this.articleService.findAll({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
      where: { isPublished: true },
    });

    return {
      list: list.map((item) => new ArticleSummaryEntity(item)),
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    };
  }

  @ApiOperation({ summary: '获取文章列表' })
  @OnlyMaxRole()
  @Get()
  @ApiOkResponse({ type: ArticleSummaryEntity, isArray: true })
  async findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ): Promise<PageData<ArticleSummaryEntity>> {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);

    const { list, total } = await this.articleService.findAll({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    });

    return {
      list: list.map((item) => new ArticleSummaryEntity(item)),
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    };
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Public()
  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id') id: string): Promise<Article | null> {
    return this.articleService.findOne(id);
  }

  @ApiOperation({ summary: '更新文章' })
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

  @ApiOperation({ summary: '修改文章发布状态' })
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

  @ApiOperation({ summary: '删除文章' })
  @OnlyMaxRole()
  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id') id: string): Promise<Article> {
    return this.articleService.remove(id);
  }
}
