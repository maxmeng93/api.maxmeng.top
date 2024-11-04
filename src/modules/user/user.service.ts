import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { CreateUserDTO } from './dto/users.dto';
import { PrismaService } from '../prisma/prisma.service';
import { encryptPassword } from 'src/utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDTO) {
    const { username, password } = createUserDto;

    const existUser = await this.findOneByName(username);
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await encryptPassword(password);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll(params: {
    skip: number;
    take: number;
    where?: Prisma.UserWhereInput;
  }): Promise<{ list: User[]; total: number }> {
    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: {
          createTime: 'desc',
        },
      }),
      this.prisma.user.count({ where: params.where }),
    ]);
    return { list, total };
  }

  async findOne(id: string): Promise<User> {
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

  async currentUserInfo(user: RequestUser): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: user.userId },
    });
  }
}
