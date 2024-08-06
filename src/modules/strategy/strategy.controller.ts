import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { Strategy as StrategyModel } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';

@Controller('strategies')
@ApiTags('strategy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  @ApiBody({ type: CreateStrategyDto })
  @ApiResponse({
    status: 201,
    description: 'The strategy has been successfully created.',
    type: CreateStrategyDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createStrategyDto: CreateStrategyDto): Promise<StrategyModel> {
    return this.strategyService.create(createStrategyDto);
  }

  @Get()
  findAll(): Promise<StrategyModel[]> {
    return this.strategyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<StrategyModel> {
    return this.strategyService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<StrategyModel> {
    return this.strategyService.remove(id);
  }
}
