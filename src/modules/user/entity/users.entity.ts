import { User, UserRole } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nickname: string;

  @Exclude()
  password: string;

  @ApiProperty({ description: '头像' })
  avatar: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({
    description: '角色',
    enum: UserRole,
    enumName: 'UserRole',
  })
  role: UserRole;

  @ApiProperty({ description: '邮箱是否验证' })
  isEmailVerified: boolean;

  @ApiProperty({ description: '邮箱验证失败次数' })
  emailFailCount: number;

  @ApiProperty({ description: '创建日期' })
  createTime: Date;

  @ApiProperty({ description: '更新日期' })
  updateTime: Date;

  @ApiProperty({ description: '最后登录时间' })
  lastLoginTime: Date;
}
