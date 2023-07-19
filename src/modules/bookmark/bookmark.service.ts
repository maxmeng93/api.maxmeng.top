import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateBookmarkDTO } from './bookmark.dto';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: TreeRepository<Bookmark>,
  ) {}

  async findAll(): Promise<Bookmark[]> {
    return await this.bookmarkRepository.findTrees();
  }

  async addOne(body: CreateBookmarkDTO): Promise<void> {
    const { parentId } = body;
    let parent;
    if (parentId) {
      parent = await this.bookmarkRepository.findOneBy({ id: parentId });
    }
    await this.bookmarkRepository.save({ ...body, parent });
  }
}
