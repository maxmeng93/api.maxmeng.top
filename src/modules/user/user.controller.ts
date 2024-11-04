import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/users.dto';
import { UserEntity } from './entity/users.entity';
import { UserService } from './user.service';
import { Public, OnlyMaxRole } from 'src/constants';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ type: UserEntity })
  @Public()
  @Post('register')
  async register(@Body() createUser: CreateUserDTO) {
    return new UserEntity(await this.userService.register(createUser));
  }

  @ApiOperation({ summary: '查找所有用户' })
  @ApiResponse({ type: UserEntity, isArray: true })
  @OnlyMaxRole()
  @Get('list')
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('username') username?: string,
    @Query('email') email?: string,
  ): Promise<{
    list: UserEntity[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { list, total } = await this.userService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        username: { contains: username },
        email: { contains: email },
      },
    });
    return {
      list: list.map((user) => new UserEntity(user)),
      total,
      page: page,
      pageSize: pageSize,
    };
  }

  @ApiOperation({ summary: '根据用户名查找用户' })
  @ApiResponse({ type: UserEntity })
  @OnlyMaxRole()
  @Get('find')
  async findOne(@Query('username') username: string): Promise<UserEntity> {
    return new UserEntity(await this.userService.findOneByName(username));
  }

  @ApiOperation({ summary: '查询当前用户信息' })
  @ApiResponse({ type: UserEntity })
  @Get('info')
  async currentUser(@Request() req): Promise<UserEntity> {
    const user: RequestUser = req.user;
    return new UserEntity(await this.userService.currentUserInfo(user));
  }
}
