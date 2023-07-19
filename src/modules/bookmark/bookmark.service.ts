import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookmarkDTO } from './bookmark.dto';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async findAll(): Promise<Bookmark[]> {
    return await this.bookmarkRepository.find();
  }

  async addOne(body: CreateBookmarkDTO): Promise<void> {
    await this.bookmarkRepository.create(body);
  }
}
