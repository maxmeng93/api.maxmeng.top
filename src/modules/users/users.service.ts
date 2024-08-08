import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDTO } from './dto/users.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(createUser: CreateUserDTO) {
    const { username } = createUser;

    const existUser = await this.findOneByName(username);
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.user.create({
      data: createUser,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByName(username: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { username },
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
