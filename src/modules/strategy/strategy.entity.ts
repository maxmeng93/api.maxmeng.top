import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StrategyDetail } from './strategy-detail.entity';

@Entity()
export class Strategy {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '策略名' })
  @Column()
  name: string;

  @ApiProperty({ description: 'etf编码' })
  @Column()
  etfCode: string;

  @ApiProperty({ description: '用户' })
  @Column()
  user: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '策略详情' })
  @OneToMany(() => StrategyDetail, (detail) => detail.strategy, {
    cascade: true,
  })
  details: StrategyDetail[];
}
