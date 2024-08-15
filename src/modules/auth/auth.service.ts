import { compareSync } from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
  LoginDTO,
} from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { encryptPassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByName(username);

    if (!user) {
      throw new BadRequestException('用户名不存在');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误');
    }

    return user;
  }

  async login(data: LoginDTO) {
    const user = await this.userService.findOneByName(data.username);

    if (!user) {
      throw new BadRequestException('用户名不存在');
    }

    if (!compareSync(data.password, user.password)) {
      throw new BadRequestException('密码错误');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async requestPasswordReset(data: RequestPasswordResetDto): Promise<void> {
    const { email } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    const resetLink = `https://etf.maxmeng.top/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      // from: 'xxx@xxx.xxx',
      to: email,
      subject: '密码重置',
      html: `点击这里重置密码: <a href="${resetLink}" target="_blank">重置密码</a>`,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password } = resetPasswordDto;

    const payload = this.jwtService.verify(token);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await encryptPassword(password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}
