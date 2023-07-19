import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { BookmarkType } from './bookmark.interface';

@Entity()
@Tree('materialized-path')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '父级ID' })
  @Column()
  pid: number;

  @ApiProperty({ description: '标题' })
  @Column()
  title: string;

  @ApiProperty({ description: '类型' })
  @Column({ type: 'enum', enum: BookmarkType, default: BookmarkType.bookmark })
  type: BookmarkType;

  @ApiProperty({ description: '链接' })
  @Column({ default: '' })
  link: string;

  @ApiProperty({ description: '子级' })
  @TreeChildren()
  children: Bookmark[];

  @ApiProperty({ description: '父级' })
  @TreeParent()
  parent: Bookmark;
}
