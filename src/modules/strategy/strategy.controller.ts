import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { Strategy, StrategyTrade } from '@prisma/client';
import {
  CreateStrategyDto,
  UpdateStrategyDto,
} from './dto/create-strategy.dto';
import { CreateStrategyTradeDto } from './dto/create-strategy-trade.dto';
import { StrategyEntity } from './entity/strategy.entity';
import { StrategyTradeEntity } from './entity/strategy-trade.entity';

@Controller('strategiy')
@ApiTags('strategiy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @ApiOperation({ summary: '创建网格策略' })
  @Post()
  @ApiBody({ type: CreateStrategyDto })
  @ApiCreatedResponse({ type: StrategyEntity })
  create(
    @Body() createStrategyDto: CreateStrategyDto,
    @Request() req,
  ): Promise<Strategy> {
    const user: RequestUser = req.user;
    return this.strategyService.create(user.userId, createStrategyDto);
  }

  @ApiOperation({ summary: '获取网格策略列表' })
  @Get()
  @ApiOkResponse({ type: StrategyEntity, isArray: true })
  findAll(@Request() req): Promise<Strategy[]> {
    const user: RequestUser = req.user;
    return this.strategyService.findAll(user.userId);
  }

  @ApiOperation({ summary: '获取当个网格策略详情' })
  @Get(':id')
  @ApiOkResponse({ type: StrategyEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Strategy> {
    return this.strategyService.findOne(id);
  }

  @ApiOperation({ summary: '更新网格策略' })
  @Put(':id')
  @ApiBody({ type: CreateStrategyDto })
  @ApiOkResponse({ type: StrategyEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStrategyDto: UpdateStrategyDto,
  ): Promise<Strategy> {
    return this.strategyService.update(id, updateStrategyDto);
  }

  @ApiOperation({ summary: '删除网格策略' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<null> {
    return this.strategyService.remove(id);
  }

  @ApiOperation({ summary: '新增网格策略交易' })
  @Post(':id/trade')
  @ApiBody({ type: CreateStrategyTradeDto })
  @ApiCreatedResponse({ type: StrategyTradeEntity })
  createTrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateStrategyTradeDto,
  ): Promise<StrategyTrade> {
    return this.strategyService.createTrade(id, data);
  }

  @ApiOperation({ summary: '获取网格策略交易列表' })
  @Get(':id/trade')
  @ApiOkResponse({ type: StrategyTradeEntity, isArray: true })
  findTradeByStrategyId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StrategyTrade[]> {
    return this.strategyService.findTradeByStrategyId(id);
  }

  @ApiOperation({ summary: '删除网格策略交易' })
  @Delete('trade/:id')
  removeTrade(@Param('id', ParseIntPipe) id: number): Promise<StrategyTrade> {
    return this.strategyService.removeTrade(id);
  }
}
