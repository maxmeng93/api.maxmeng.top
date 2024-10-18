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
  Query,
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
import { OnlyMaxRole } from 'src/constants';

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
    return this.strategyService.create(user, createStrategyDto);
  }

  @ApiOperation({ summary: '获取当前用户的网格策略列表' })
  @Get('my')
  @ApiOkResponse({ type: StrategyEntity, isArray: true })
  findMyGrids(@Request() req): Promise<Strategy[]> {
    const user: RequestUser = req.user;
    return this.strategyService.findMyGrids(user);
  }

  @ApiOperation({ summary: '获取所有网格策略' })
  @Get()
  @OnlyMaxRole()
  @ApiOkResponse({ type: StrategyEntity, isArray: true })
  async findAllGrids(
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('username') username,
  ): Promise<{
    list: Strategy[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { list, total } = await this.strategyService.findAllGrids({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: username ? { User: { username: username } } : undefined,
    });

    return {
      list,
      total,
      page: page,
      pageSize: pageSize,
    };
  }

  @ApiOperation({ summary: '获取单个网格策略详情' })
  @Get(':id')
  @ApiOkResponse({ type: StrategyEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Strategy> {
    const user: RequestUser = req.user;
    return this.strategyService.findOne(id, user);
  }

  @ApiOperation({ summary: '更新网格策略' })
  @Put(':id')
  @ApiBody({ type: CreateStrategyDto })
  @ApiOkResponse({ type: StrategyEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStrategyDto: UpdateStrategyDto,
    @Request() req,
  ): Promise<Strategy> {
    const user: RequestUser = req.user;
    return this.strategyService.update(id, updateStrategyDto, user);
  }

  @ApiOperation({ summary: '删除网格策略' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<null> {
    const user: RequestUser = req.user;
    return this.strategyService.remove(id, user);
  }

  @ApiOperation({ summary: '新增网格策略交易' })
  @Post(':id/trade')
  @ApiBody({ type: CreateStrategyTradeDto })
  @ApiCreatedResponse({ type: StrategyTradeEntity })
  createTrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateStrategyTradeDto,
    @Request() req,
  ): Promise<StrategyTrade> {
    const user: RequestUser = req.user;
    return this.strategyService.createTrade(id, data, user);
  }

  @ApiOperation({ summary: '获取网格策略交易列表' })
  @Get(':id/trade')
  @ApiOkResponse({ type: StrategyTradeEntity, isArray: true })
  findTradeByStrategyId(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<StrategyTrade[]> {
    const user: RequestUser = req.user;
    return this.strategyService.findTradeByStrategyId(id, user);
  }

  @ApiOperation({ summary: '删除网格策略交易' })
  @Delete('trade/:id')
  removeTrade(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<StrategyTrade> {
    const user: RequestUser = req.user;
    return this.strategyService.removeTrade(id, user);
  }

  @ApiOperation({ summary: '修改网格策略交易' })
  @Put('trade/:id')
  @ApiBody({ type: CreateStrategyTradeDto })
  @ApiOkResponse({ type: StrategyTradeEntity })
  updateTrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateStrategyTradeDto,
    @Request() req,
  ): Promise<StrategyTrade> {
    const user: RequestUser = req.user;
    return this.strategyService.updateTrade(id, data, user);
  }
}
