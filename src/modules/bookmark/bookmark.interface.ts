import { Document } from 'mongoose';

export interface Bookmark extends Document {
  readonly _id: number;
  readonly title: string;
  readonly url: string;
  readonly parentId: number;
}
