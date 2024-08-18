import { Injectable, NotFoundException } from '@nestjs/common';
import { Strategy, StrategyTrade, Prisma } from '@prisma/client';
import {
  CreateStrategyDto,
  UpdateStrategyDto,
} from './dto/create-strategy.dto';
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

  async findAll(userId: string): Promise<Strategy[]> {
    return this.prisma.strategy.findMany({
      include: { details: true },
      where: { User: { id: userId } },
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

  async update(id: number, data: UpdateStrategyDto): Promise<Strategy> {
    const strategyData: Prisma.StrategyUpdateInput = {
      ...data,
      details: {
        upsert: data.details?.map((detail) => ({
          where: { id: detail.id ?? 0 },
          update: {
            type: detail.type,
            level: detail.level,
            buyPrice: detail.buyPrice,
            buyQuantity: detail.buyQuantity,
            buyAmount: detail.buyAmount,
            sellPrice: detail.sellPrice,
            sellQuantity: detail.sellQuantity,
            sellAmount: detail.sellAmount,
            strategyId: detail.strategyId,
          },
          create: {
            type: detail.type,
            level: detail.level,
            buyPrice: detail.buyPrice,
            buyQuantity: detail.buyQuantity,
            buyAmount: detail.buyAmount,
            sellPrice: detail.sellPrice,
            sellQuantity: detail.sellQuantity,
            sellAmount: detail.sellAmount,
            strategyId: id,
          },
        })),
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
