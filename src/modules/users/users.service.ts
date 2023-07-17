import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Public } from '../auth/constants';
import { CreateUserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Public()
  async register(createUser: CreateUserDTO) {
    const { username } = createUser;

    const existUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.usersRepository.create(createUser);
    return await this.usersRepository.save(newUser);
  }

  @Public()
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByName(name: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username: name });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
