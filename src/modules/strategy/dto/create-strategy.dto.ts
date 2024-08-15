import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStrategyDetailDto } from './create-strategy-detail.dto';

export class CreateStrategyDto {
  @ApiProperty({ description: '策略名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'etf编码' })
  @IsString()
  @IsNotEmpty()
  etfCode: string;

  // @ApiProperty({ description: '用户' })
  // @IsString()
  // @IsNotEmpty()
  // userId: string;

  @ApiProperty({ description: '策略详情', type: [CreateStrategyDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyDetailDto)
  details: CreateStrategyDetailDto[];
}
