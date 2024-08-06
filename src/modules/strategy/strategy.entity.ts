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
  @Column({ name: 'etf_code' })
  etfCode: string;

  @ApiProperty({ description: '用户' })
  @Column()
  user: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '策略详情' })
  @OneToMany(() => StrategyDetail, (detail) => detail.strategy, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  details: StrategyDetail[];
}
