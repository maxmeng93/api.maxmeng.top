import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guards';
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

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Body() user: LoginDTO, @Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('request-password-reset')
  @ApiBody({ type: RequestPasswordResetDto })
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
