import { Body, Controller, Post, Get, Query } from '@nestjs/common';
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
  async findAll(@Query('page') page = '1', @Query('pageSize') pageSize = '10') {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);
    const { list, total } = await this.userService.findAll({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    });
    return {
      list: list.map((user) => new UserEntity(user)),
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    };
  }

  @ApiOperation({ summary: '根据用户名查找用户' })
  @ApiResponse({ type: UserEntity })
  @Get('find')
  async findOne(@Query('username') username: string): Promise<UserEntity> {
    return new UserEntity(await this.userService.findOneByName(username));
  }
}
