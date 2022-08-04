import { Document } from 'mongoose';

export enum BookmarkType {
  /** 文件夹 */
  Folder = 1,
  /** 书签 */
  Bookmark = 2,
}

export interface Bookmark extends Document {
  readonly _id: number;
  readonly type: BookmarkType;
  readonly title: string;
  readonly url: string;
  readonly pid: number;
}
