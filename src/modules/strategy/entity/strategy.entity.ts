import { Strategy } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { StrategyDetailEntity } from './strategy-detail.entity';

export class StrategyEntity implements Strategy {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: '策略名' })
  name: string;

  @ApiProperty({ description: 'etf编码' })
  etfCode: string;

  @ApiProperty({ description: '用户' })
  userId: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '策略详情' })
  details: StrategyDetailEntity[];
}
