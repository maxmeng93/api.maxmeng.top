import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { Strategy } from './strategy.entity';

@Controller('strategies')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  create(@Body() createStrategyDto: CreateStrategyDto): Promise<Strategy> {
    return this.strategyService.create(createStrategyDto);
  }

  @Get()
  findAll(): Promise<Strategy[]> {
    return this.strategyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Strategy> {
    return this.strategyService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.strategyService.remove(id);
  }
}
