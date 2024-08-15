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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { Strategy, StrategyTrade } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { CreateStrategyTradeDto } from './dto/create-strategy-trade.dto';
import { StrategyEntity } from './entity/strategy.entity';
import { StrategyTradeEntity } from './entity/strategy-trade.entity';

@Controller('strategiy')
@ApiTags('strategiy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  @ApiBody({ type: CreateStrategyDto })
  @ApiCreatedResponse({ type: StrategyEntity })
  create(
    @Body() createStrategyDto: CreateStrategyDto,
    @Request() req,
  ): Promise<Strategy> {
    return this.strategyService.create(req.user.userId, createStrategyDto);
  }

  @Get()
  @ApiOkResponse({ type: StrategyEntity, isArray: true })
  findAll(): Promise<Strategy[]> {
    return this.strategyService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: StrategyEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Strategy> {
    return this.strategyService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: CreateStrategyDto })
  @ApiOkResponse({ type: StrategyEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStrategyDto: CreateStrategyDto,
  ): Promise<Strategy> {
    return this.strategyService.update(id, updateStrategyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<null> {
    return this.strategyService.remove(id);
  }

  @Post(':id/trade')
  @ApiBody({ type: CreateStrategyTradeDto })
  @ApiCreatedResponse({ type: StrategyTradeEntity })
  createTrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateStrategyTradeDto,
  ): Promise<StrategyTrade> {
    return this.strategyService.createTrade(id, data);
  }

  @Get(':id/trade')
  @ApiOkResponse({ type: StrategyTradeEntity, isArray: true })
  findTradeByStrategyId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StrategyTrade[]> {
    return this.strategyService.findTradeByStrategyId(id);
  }
}
