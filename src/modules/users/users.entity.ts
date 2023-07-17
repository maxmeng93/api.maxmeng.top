import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({ description: '用户名' })
  @Column({ length: 100 })
  username: string;

  @ApiProperty({ description: '昵称' })
  @Column({ length: 100 })
  nickname: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: '头像' })
  @Column({ default: '' })
  avatar: string;

  @ApiProperty({ description: '邮箱' })
  @Column({ default: '' })
  email: string;

  // @Column('simple-enum', { enum: ['admin', 'user'] })
  // role: string;

  @ApiProperty({ description: '创建日期' })
  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @ApiProperty({ description: '更新日期' })
  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;
}
