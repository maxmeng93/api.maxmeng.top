import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookmarkDTO } from './bookmark.dto';
import { Bookmark } from './bookmark.interface';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel('Bookmarks') private readonly bookmarkModel: Model<Bookmark>,
  ) {}

  async findAll(): Promise<Bookmark[]> {
    return await this.bookmarkModel.find();
  }

  async addOne(body: CreateBookmarkDTO): Promise<void> {
    await this.bookmarkModel.create(body);
  }
}
