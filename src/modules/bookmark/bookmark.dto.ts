import { BookmarkType } from './bookmark.interface';

export class CreateBookmarkDTO {
  readonly _id: number;
  readonly type: BookmarkType;
  readonly title: string;
  readonly url: string;
  readonly pid: number;
}
