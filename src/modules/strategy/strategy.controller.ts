import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { Strategy as StrategyModel } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { StrategyEntity } from './entity/strategy.entity';

@Controller('strategies')
@ApiTags('strategies')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  @ApiBody({ type: CreateStrategyDto }) // 请求体（request body）
  @ApiCreatedResponse({ type: StrategyEntity })
  // @ApiResponse({ status: 200, type: CreateStrategyDto })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createStrategyDto: CreateStrategyDto): Promise<StrategyModel> {
    return this.strategyService.create(createStrategyDto);
  }

  @Get()
  @ApiOkResponse({ type: StrategyEntity, isArray: true })
  findAll(): Promise<StrategyModel[]> {
    return this.strategyService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: StrategyEntity })
  findOne(@Param('id') id: string): Promise<StrategyModel> {
    return this.strategyService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<null> {
    return this.strategyService.remove(+id);
  }
}
