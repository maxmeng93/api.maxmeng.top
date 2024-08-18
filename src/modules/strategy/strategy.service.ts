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
    return this.prisma.$transaction(async (prisma) => {
      // 先更新 Strategy 本身的数据
      const updatedStrategy = await prisma.strategy.update({
        where: { id: id },
        data: {
          name: data.name,
          etfCode: data.etfCode,
          updatedAt: new Date(),
        },
      });

      if (data.details) {
        const newDetails = data.details;

        // 获取当前数据库中所有与该策略关联的details
        const existingDetails = await prisma.strategyDetail.findMany({
          where: { strategyId: id },
        });

        // 构建一个新的 Set 来保存传入的 detail IDs
        const newDetailIds = new Set<number>();
        newDetails.forEach((detail) => {
          if (detail.id) {
            newDetailIds.add(detail.id as number);
          }
        });

        // 删除数据库中存在但不在新传入的details中的那些条目
        for (const existingDetail of existingDetails) {
          if (!newDetailIds.has(existingDetail.id)) {
            await prisma.strategyDetail.delete({
              where: { id: existingDetail.id },
            });
          }
        }

        for (const detail of newDetails) {
          if (detail.id && detail.id > 0) {
            // 如果 detail 中的 id 存在，则尝试更新
            const existingDetail = await prisma.strategyDetail.findUnique({
              where: { id: detail.id as number },
            });

            if (existingDetail) {
              // 如果能找到对应的记录，执行更新
              await prisma.strategyDetail.update({
                where: { id: detail.id as number },
                data: {
                  type: detail.type,
                  level: detail.level,
                  buyPrice: detail.buyPrice,
                  buyQuantity: detail.buyQuantity,
                  buyAmount: detail.buyAmount,
                  sellPrice: detail.sellPrice,
                  sellQuantity: detail.sellQuantity,
                  sellAmount: detail.sellAmount,
                },
              });
            } else {
              // 如果找不到记录，抛出异常或处理错误
              throw new Error(`Detail with id ${detail.id} not found`);
            }
          } else {
            // 如果 id 不存在，则创建新的 detail 记录
            await prisma.strategyDetail.create({
              data: {
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
            });
          }
        }
      }

      // 查询并附加更新后的 details
      const updatedDetails = await prisma.strategyDetail.findMany({
        where: { strategyId: id },
      });

      return {
        ...updatedStrategy,
        details: updatedDetails,
      };
    });
  }

  async remove(id: number): Promise<null> {
    await this.prisma.strategyDetail.deleteMany({
      where: { strategyId: id },
    });

    await this.prisma.strategyTrade.deleteMany({
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

  async removeTrade(id: number): Promise<StrategyTrade> {
    return await this.prisma.strategyTrade.delete({
      where: { id },
    });
  }
}
