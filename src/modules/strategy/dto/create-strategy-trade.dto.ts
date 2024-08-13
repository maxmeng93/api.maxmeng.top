import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { TradeType } from '@prisma/client';

export class CreateStrategyTradeDto {
  @ApiProperty({
    description: '交易类型',
    enum: TradeType,
    enumName: 'TradeType',
  })
  @IsString()
  @IsNotEmpty()
  type: TradeType;

  @ApiProperty({ description: '价格' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: '数量' })
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: '总金额' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: '佣金' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  @IsNotEmpty()
  brokerage: number;

  // @ApiProperty({ description: '策略ID' })
  // @IsInt()
  // @IsNotEmpty()
  // strategyId: number;
}
