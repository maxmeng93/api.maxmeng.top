import { BookmarkType } from './bookmark.interface';

export class CreateBookmarkDTO {
  readonly type: BookmarkType;
  readonly title: string;
  readonly url: string;
  readonly pid: number;
}

export class BookmarkDTO {
  readonly id: number;
  readonly type: BookmarkType;
  readonly title: string;
  readonly url: string;
  readonly pid: number;
  readonly children: BookmarkDTO[];
}
