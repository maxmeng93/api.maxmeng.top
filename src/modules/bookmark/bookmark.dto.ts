import { ApiProperty } from '@nestjs/swagger';
import { BookmarkType } from './bookmark.interface';

export class CreateBookmarkDTO {
  @ApiProperty({ description: '类型', enum: BookmarkType })
  readonly type: BookmarkType;

  @ApiProperty({ description: '标题' })
  readonly title: string;

  @ApiProperty({ description: '链接' })
  readonly link: string;

  @ApiProperty({ description: '父级ID' })
  readonly pid: number;
}
