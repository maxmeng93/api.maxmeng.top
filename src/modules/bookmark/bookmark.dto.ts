import { OmitType } from '@nestjs/swagger';
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

export class CreateBookmarkTreeDTO extends OmitType(CreateBookmarkDTO, [
  'pid',
] as const) {
  @ApiProperty({ description: '子级', type: [CreateBookmarkTreeDTO] })
  readonly children: CreateBookmarkTreeDTO[];
}
