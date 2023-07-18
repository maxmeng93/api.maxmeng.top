import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './users.dto';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/constants';

// interface UserResponse<T = unknown> {
//   code: number;
//   data?: T;
//   message: string;
// }

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, type: User })
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('register')
  register(@Body() createUser: CreateUserDTO) {
    return this.userService.register(createUser);
  }

  @ApiOperation({ summary: '查找所有用户' })
  @ApiResponse({ status: 200, type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get('list')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '根据用户名查找用户' })
  @ApiResponse({ status: 200, type: User })
  @Get('find')
  findOne(@Query('username') username: string) {
    return this.userService.findOneByName(username);
  }
}
