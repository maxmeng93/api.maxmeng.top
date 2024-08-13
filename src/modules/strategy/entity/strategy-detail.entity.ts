import { StrategyDetail, StrategyType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class StrategyDetailEntity implements StrategyDetail {
  id: number;

  @ApiProperty({ description: '档位' })
  @Transform(({ value }) => parseFloat(value))
  level: number;

  @ApiProperty({ description: '类型' })
  type: StrategyType;

  @ApiProperty({ description: '买入价' })
  @Transform(({ value }) => parseFloat(value))
  buyPrice: number;

  @ApiProperty({ description: '入股数' })
  buyQuantity: number;

  @ApiProperty({ description: '买入金额' })
  @Transform(({ value }) => parseFloat(value))
  buyAmount: number;

  @ApiProperty({ description: '卖出价' })
  sellPrice: number;

  @ApiProperty({ description: '出股数' })
  sellQuantity: number;

  @ApiProperty({ description: '卖出金额' })
  sellAmount: number;

  @ApiProperty({ description: '策略ID' })
  strategyId: number;
}
