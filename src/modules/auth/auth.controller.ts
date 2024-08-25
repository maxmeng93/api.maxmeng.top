import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './auth.dto';
import { Public } from 'src/constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @Public()
  @Post('login')
  signIn(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: '请求重置密码' })
  @Public()
  @Post('request-password-reset')
  @ApiBody({ type: RequestPasswordResetDto })
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @ApiOperation({ summary: '重置密码' })
  @Public()
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
