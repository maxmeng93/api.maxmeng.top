import { StrategyTrade, TradeType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class StrategyTradeEntity implements StrategyTrade {
  id: number;

  @ApiProperty({ description: '类型' })
  type: TradeType;

  @ApiProperty({ description: '价格' })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ description: '数量' })
  quantity: number;

  @ApiProperty({ description: '金额' })
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({ description: '佣金' })
  @Transform(({ value }) => parseFloat(value))
  brokerage;

  @ApiProperty({ description: '策略ID' })
  strategyId: number;
}
