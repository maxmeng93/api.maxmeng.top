import { Injectable, NotFoundException } from '@nestjs/common';
import { Strategy, Prisma } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StrategyService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStrategyDto): Promise<Strategy> {
    const strategyData: Prisma.StrategyCreateInput = {
      ...data,
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
}
