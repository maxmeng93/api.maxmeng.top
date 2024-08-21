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

  findAll() {
    return this.prisma.article.findMany({
      include: {
        author: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
