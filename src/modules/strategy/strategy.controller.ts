import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<StrategyModel> {
    return this.strategyService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: CreateStrategyDto })
  @ApiOkResponse({ type: StrategyEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStrategyDto: CreateStrategyDto,
  ): Promise<StrategyModel> {
    return this.strategyService.update(id, updateStrategyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<null> {
    return this.strategyService.remove(id);
  }
}
