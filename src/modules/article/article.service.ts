import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto, userId: string) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        authorId: userId,
      },
    });
  }

  findAll(isMax: boolean) {
    return this.prisma.article.findMany({
      where: {
        isPublished: !isMax,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: {
        ...updateArticleDto,
        updatedAt: new Date(),
      },
    });
  }

  remove(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
