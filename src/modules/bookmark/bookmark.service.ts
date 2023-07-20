import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateBookmarkDTO, CreateBookmarkTreeDTO } from './bookmark.dto';
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

  async addOne(body: CreateBookmarkDTO): Promise<Bookmark> {
    const { pid } = body;
    let parent: Bookmark;
    if (pid) {
      parent = await this.bookmarkRepository.findOneBy({ id: pid });
    }
    return await this.bookmarkRepository.save({ ...body, pid, parent });
  }

  async saveTree(
    bookmarkData: CreateBookmarkTreeDTO,
    pid = 0,
  ): Promise<Bookmark> {
    let parent;
    if (pid) {
      parent = await this.bookmarkRepository.findOneBy({ id: pid });
    }

    const bookmark = new Bookmark();
    bookmark.title = bookmarkData.title;
    bookmark.type = bookmarkData.type;
    bookmark.link = bookmarkData.link;
    bookmark.pid = pid;
    bookmark.parent = parent;
    bookmark.children = [];

    const newBookmark = await this.bookmarkRepository.save(bookmark);

    if (bookmarkData.children && bookmarkData.children.length > 0) {
      for (const child of bookmarkData.children) {
        const newChild = await this.saveTree(child, newBookmark.id);
        newBookmark.children.push(newChild);
      }
    }

    delete newBookmark.parent;

    return newBookmark;
  }
}
