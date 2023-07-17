import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  signIn(@Request() req) {
    return req.user;
    // return this.authService.validateUser(user.username, user.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
