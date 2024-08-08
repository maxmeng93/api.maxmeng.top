import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/users.dto';
import { UserEntity } from './entity/users.entity';
import { UsersService } from './users.service';
import { Public } from '../auth/constants';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('register')
  register(@Body() createUser: CreateUserDTO) {
    return this.userService.register(createUser);
  }

  @ApiOperation({ summary: '查找所有用户' })
  @ApiResponse({ type: UserEntity, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '根据用户名查找用户' })
  @ApiResponse({ type: UserEntity })
  @Get('find')
  findOne(@Query('username') username: string): Promise<UserEntity> {
    return this.userService.findOneByName(username);
  }
}
