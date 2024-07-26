import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { Strategy } from './strategy.entity';

@ApiTags('strategies')
@Controller('strategies')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @ApiOperation({ summary: '创建网格策略' })
  @ApiResponse({ type: Strategy })
  @Post()
  async createStrategy(
    @Body() strategyData: Partial<Strategy>,
  ): Promise<Strategy> {
    return this.strategyService.createStrategy(strategyData);
  }

  @ApiOperation({ summary: '获取所有网格策略' })
  @ApiResponse({ type: [Strategy] })
  @Get()
  async findAll(): Promise<Strategy[]> {
    return this.strategyService.findAll();
  }
}
