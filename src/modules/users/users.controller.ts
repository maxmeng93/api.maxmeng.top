import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './users.dto';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// interface UserResponse<T = unknown> {
//   code: number;
//   data?: T;
//   message: string;
// }

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() createUser: CreateUserDTO) {
    return this.userService.register(createUser);
  }
}
