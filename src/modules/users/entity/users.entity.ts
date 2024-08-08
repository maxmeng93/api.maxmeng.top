import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
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

  // @Column('simple-enum', { enum: ['admin', 'user'] })
  // role: string;

  @ApiProperty({ description: '创建日期' })
  createTime: Date;

  @ApiProperty({ description: '更新日期' })
  updateTime: Date;
}
