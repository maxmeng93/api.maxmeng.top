import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto, userId: string): Promise<Article> {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        authorId: userId,
      },
    });
  }

  findAll(isMax: boolean): Promise<Article[]> {
    return this.prisma.article.findMany({
      where: {
        isPublished: !isMax,
      },
    });
  }

  findOne(id: string): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    return this.prisma.article.update({
      where: { id },
      data: {
        ...updateArticleDto,
        updatedAt: new Date(),
      },
    });
  }

  changePublish(id: string, isPublished: boolean): Promise<Article> {
    return this.prisma.article.update({
      where: { id },
      data: {
        isPublished: isPublished,
        updatedAt: new Date(),
      },
    });
  }

  remove(id: string): Promise<Article> {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
