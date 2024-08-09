import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/users.dto';
import { UserEntity } from './entity/users.entity';
import { UsersService } from './users.service';
import { Public } from '../auth/constants';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ type: UserEntity })
  @Public()
  @Post('register')
  async register(@Body() createUser: CreateUserDTO) {
    return new UserEntity(await this.usersService.register(createUser));
  }

  @ApiOperation({ summary: '查找所有用户' })
  @ApiResponse({ type: UserEntity, isArray: true })
  @Get('list')
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @ApiOperation({ summary: '根据用户名查找用户' })
  @ApiResponse({ type: UserEntity })
  @Get('find')
  async findOne(@Query('username') username: string): Promise<UserEntity> {
    return new UserEntity(await this.usersService.findOneByName(username));
  }
}
