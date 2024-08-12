import { compareSync } from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entity/users.entity';
import { RequestPasswordResetDto, ResetPasswordDto } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { encryptPassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);

    if (!user) {
      throw new BadRequestException('用户名不存在');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误');
    }

    return user;
  }

  async login(user: UserEntity) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
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
