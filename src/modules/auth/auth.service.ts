import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);

    if (!user) {
      throw new BadRequestException('用户名不存在');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误');
    }

    const { password: _, ...result } = user;

    return result;
  }
}
