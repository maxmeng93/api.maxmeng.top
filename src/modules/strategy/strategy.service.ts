import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Strategy, StrategyTrade, Prisma, UserRole } from '@prisma/client';
import {
  CreateStrategyDto,
  UpdateStrategyDto,
} from './dto/create-strategy.dto';
import { CreateStrategyTradeDto } from './dto/create-strategy-trade.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../user/entity/users.entity';

@Injectable()
export class StrategyService {
  constructor(private prisma: PrismaService) {}

  async create(user: RequestUser, data: CreateStrategyDto): Promise<Strategy> {
    const strategyData: Prisma.StrategyCreateInput = {
      ...data,
      User: {
        connect: { id: user.userId },
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

  // 获取当前用户的网格策略列表
  async findMyGrids(user: RequestUser): Promise<Strategy[]> {
    return this.prisma.strategy.findMany({
      include: { details: true },
      where: { User: { id: user.userId } },
    });
  }

  // 获取所有用户的网格策略
  async findAllGrids(params: {
    skip: number;
    take: number;
    where?: Prisma.StrategyWhereInput;
  }): Promise<{ list: Strategy[]; total: number }> {
    const [list, total] = await Promise.all([
      this.prisma.strategy.findMany({
        include: { details: true, User: true },
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.strategy.count({
        where: params.where,
      }),
    ]);
    const newList = list.map((item) => {
      const { User, ...rest } = item;
      return {
        ...rest,
        user: new UserEntity(User),
      };
    });
    return { list: newList, total };
  }

  async findOne(id: number, user: RequestUser): Promise<Strategy> {
    const strategy = await this.ensureOwnership(id, user);
    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
    return strategy;
  }

  async update(
    id: number,
    data: UpdateStrategyDto,
    user: RequestUser,
  ): Promise<Strategy> {
    await this.ensureOwnership(id, user);
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

  async remove(id: number, user: RequestUser): Promise<null> {
    await this.ensureOwnership(id, user);
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
    user: RequestUser,
  ): Promise<StrategyTrade> {
    await this.ensureOwnership(strategyId, user);
    return await this.prisma.strategyTrade.create({
      data: { ...data, strategyId: strategyId },
    });
  }

  async findTradeByStrategyId(
    strategyId: number,
    user: RequestUser,
  ): Promise<StrategyTrade[]> {
    await this.ensureOwnership(strategyId, user);
    return this.prisma.strategyTrade.findMany({
      where: { strategyId: strategyId },
    });
  }

  async removeTrade(id: number, user: RequestUser): Promise<StrategyTrade> {
    const trade = await this.prisma.strategyTrade.findUnique({
      where: { id },
    });
    if (!trade) {
      throw new NotFoundException('数据不存在');
    }
    await this.ensureOwnership(trade.strategyId, user);
    return await this.prisma.strategyTrade.delete({
      where: { id },
    });
  }

  async updateTrade(
    id: number,
    data: CreateStrategyTradeDto,
    user: RequestUser,
  ): Promise<StrategyTrade> {
    const trade = await this.prisma.strategyTrade.findUnique({
      where: { id },
    });
    if (!trade) {
      throw new NotFoundException('数据不存在');
    }
    await this.ensureOwnership(trade.strategyId, user);
    return await this.prisma.strategyTrade.update({
      where: { id },
      data: { ...data },
    });
  }

  // 确保用户有权操作策略
  private async ensureOwnership(
    strategyId: number,
    user: RequestUser,
  ): Promise<Strategy> {
    const { userId, role } = user;
    const strategy = await this.prisma.strategy.findUnique({
      where: { id: strategyId },
      include: { details: true },
    });
    if (!strategy) {
      throw new NotFoundException('数据不存在');
    }

    if (strategy.userId === userId) {
      return strategy;
    }

    if (role === UserRole.MAX) {
      return strategy;
    }

    throw new ForbiddenException('权限不足');
  }
}
