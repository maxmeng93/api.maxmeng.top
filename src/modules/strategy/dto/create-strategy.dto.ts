import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateStrategyDetailDto,
  UpdateStrategyDetailDto,
} from './create-strategy-detail.dto';

export class CreateStrategyDto {
  @ApiProperty({ description: '策略名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'etf编码' })
  @IsString()
  @IsOptional()
  etfCode: string;

  @ApiProperty({ description: '策略详情', type: [CreateStrategyDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyDetailDto)
  details: CreateStrategyDetailDto[];
}

export class UpdateStrategyDto extends CreateStrategyDto {
  @ApiProperty({ description: '策略详情', type: [UpdateStrategyDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStrategyDetailDto)
  details: UpdateStrategyDetailDto[];
}
