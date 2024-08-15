import { Injectable, NotFoundException } from '@nestjs/common';
import { Strategy, StrategyTrade, Prisma } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { CreateStrategyTradeDto } from './dto/create-strategy-trade.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class StrategyService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(userId: string, data: CreateStrategyDto): Promise<Strategy> {
    const user = await this.userService.findOne(userId);

    const strategyData: Prisma.StrategyCreateInput = {
      ...data,
      User: {
        connect: { id: user.id },
      },
      details: {
        create: data.details,
      },
    };

    return this.prisma.strategy.create({
      data: strategyData,
      include: { details: true },
    });
  }

  async findAll(): Promise<Strategy[]> {
    return this.prisma.strategy.findMany({
      include: { details: true },
    });
  }

  async findOne(id: number): Promise<Strategy> {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id },
      include: { details: true },
    });
    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
    return strategy;
  }

  async update(id: number, data: CreateStrategyDto): Promise<Strategy> {
    const strategyData: Prisma.StrategyUpdateInput = {
      ...data,
      details: {
        deleteMany: {},
        create: data.details,
      },
    };

    return this.prisma.strategy.update({
      where: { id },
      data: strategyData,
      include: { details: true },
    });
  }

  async remove(id: number): Promise<null> {
    // 先删除关联的 StrategyDetail
    await this.prisma.strategyDetail.deleteMany({
      where: { strategyId: id },
    });

    await this.prisma.strategy.delete({
      where: { id },
    });

    return null;
  }

  async createTrade(
    strategyId: number,
    data: CreateStrategyTradeDto,
  ): Promise<StrategyTrade> {
    return await this.prisma.strategyTrade.create({
      data: { ...data, strategyId: strategyId },
    });
  }

  async findTradeByStrategyId(strategyId: number): Promise<StrategyTrade[]> {
    return this.prisma.strategyTrade.findMany({
      where: { strategyId: strategyId },
    });
  }
}
