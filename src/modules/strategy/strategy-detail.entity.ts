import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Strategy } from './strategy.entity';

@Entity()
export class StrategyDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '档位' })
  @Column('decimal', { precision: 3, scale: 2 })
  level: number;

  @ApiProperty({ description: '买入价' })
  @Column('decimal', { precision: 10, scale: 3 })
  buyPrice: number;

  @ApiProperty({ description: '入股数' })
  @Column('int')
  buyQuantity: number;

  @ApiProperty({ description: '买入金额' })
  @Column('decimal', { precision: 10, scale: 2 })
  buyAmount: number;

  @ApiProperty({ description: '卖出价' })
  @Column('decimal', { precision: 10, scale: 3 })
  sellPrice: number;

  @ApiProperty({ description: '出股数' })
  @Column('int')
  sellQuantity: number;

  @ApiProperty({ description: '卖出金额' })
  @Column('decimal', { precision: 10, scale: 2 })
  sellAmount: number;

  @ManyToOne(() => Strategy, (strategy) => strategy.details)
  strategy: Strategy;
}
