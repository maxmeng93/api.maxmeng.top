import { Schema } from 'mongoose';

export const bookmarkSchema = new Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: false },
  parentId: { type: Number, required: true },
});
