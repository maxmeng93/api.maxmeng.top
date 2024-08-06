import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStrategyDetailDto {
  @ApiProperty({ description: '档位' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  level: number;

  @ApiProperty({ description: '类型' })
  @IsInt()
  @IsNotEmpty()
  type: number;

  @ApiProperty({ description: '买入价' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  @IsNotEmpty()
  buyPrice: number;

  @ApiProperty({ description: '入股数' })
  @IsInt()
  @IsNotEmpty()
  buyQuantity: number;

  @ApiProperty({ description: '买入金额' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsNotEmpty()
  buyAmount: number;

  @ApiProperty({ description: '卖出价' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  @IsNotEmpty()
  sellPrice: number;

  @ApiProperty({ description: '出股数' })
  @IsInt()
  @IsNotEmpty()
  sellQuantity: number;

  @ApiProperty({ description: '卖出金额' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsNotEmpty()
  sellAmount: number;
}
