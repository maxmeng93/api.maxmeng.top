import { Injectable } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<Article> {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        authorId: userId,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ArticleWhereInput;
  }): Promise<{ list: Article[]; total: number }> {
    const { skip, take, where } = params;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        skip,
        take,
        where,
      }),
      this.prisma.article.count({ where: where }),
    ]);

    return { list: articles, total };
  }

  async findOne(id: string): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.prisma.article.update({
      where: { id },
      data: {
        ...updateArticleDto,
        updatedAt: new Date(),
      },
    });
  }

  async changePublish(id: string, isPublished: boolean): Promise<Article> {
    return this.prisma.article.update({
      where: { id },
      data: {
        isPublished: isPublished,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string): Promise<Article> {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
