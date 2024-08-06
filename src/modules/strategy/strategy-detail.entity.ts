import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Strategy } from './strategy.entity';
import { Transform } from 'class-transformer';

@Entity()
export class StrategyDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '档位' })
  @Column('decimal', { precision: 3, scale: 2 })
  @Transform(({ value }) => parseFloat(value))
  level: number;

  @ApiProperty({ description: '类型' })
  @Column('int')
  type: number;

  @ApiProperty({ description: '买入价' })
  @Column('decimal', { name: 'buy_price', precision: 10, scale: 3 })
  @Transform(({ value }) => parseFloat(value))
  buyPrice: number;

  @ApiProperty({ description: '入股数' })
  @Column('int', { name: 'buy_quantity' })
  buyQuantity: number;

  @ApiProperty({ description: '买入金额' })
  @Column('decimal', { name: 'buy_amount', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value))
  buyAmount: number;

  @ApiProperty({ description: '卖出价' })
  @Column('decimal', { name: 'sell_price', precision: 10, scale: 3 })
  @Transform(({ value }) => parseFloat(value))
  sellPrice: number;

  @ApiProperty({ description: '出股数' })
  @Column('int', { name: 'sell_quantity' })
  sellQuantity: number;

  @ApiProperty({ description: '卖出金额' })
  @Column('decimal', { name: 'sell_amount', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value))
  sellAmount: number;

  @ManyToOne(() => Strategy, (strategy) => strategy.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'strategy_id' })
  strategy: Strategy;
}
