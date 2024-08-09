import { compareSync } from 'bcrypt';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
}
