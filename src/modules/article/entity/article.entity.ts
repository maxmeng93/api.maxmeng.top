import { Article } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleEntity implements Article {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: '标题' })
  title: string;

  @ApiProperty({ description: '内容' })
  content: string;

  @ApiProperty({ description: '是否发布' })
  isPublished: boolean;

  @ApiProperty({ description: '用户' })
  authorId: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '修改时间' })
  updatedAt: Date;
}
