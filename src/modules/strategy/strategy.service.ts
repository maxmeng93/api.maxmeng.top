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
    return this.prisma.strategy.create({ data: strategyData });
  }

  async findAll(): Promise<Strategy[]> {
    return this.prisma.strategy.findMany();
  }

  async findOne(id: number): Promise<Strategy> {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id },
    });
    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
    return strategy;
  }

  async remove(id: number): Promise<Strategy> {
    return this.prisma.strategy.delete({
      where: { id },
    });
  }

  // constructor(
  //   @InjectRepository(Strategy)
  //   private strategyRepository: Repository<Strategy>,
  //   @InjectRepository(StrategyDetail)
  //   private strategyDetailRepository: Repository<StrategyDetail>,
  // ) {}

  // async create(createStrategyDto: CreateStrategyDto): Promise<Strategy> {
  //   const strategy = this.strategyRepository.create(createStrategyDto);
  //   return this.strategyRepository.save(strategy);
  // }

  // findAll(): Promise<Strategy[]> {
  //   return this.strategyRepository.find({ relations: ['details'] });
  // }

  // async findOne(id: number): Promise<Strategy> {
  //   const strategy = await this.strategyRepository.findOne({
  //     where: { id },
  //     relations: ['details'],
  //   });
  //   if (!strategy) {
  //     throw new NotFoundException(`Strategy with ID ${id} not found`);
  //   }
  //   return strategy;
  // }

  // async remove(id: number): Promise<void> {
  //   const result = await this.strategyRepository.delete(id);
  //   if (result.affected === 0) {
  //     throw new NotFoundException(`Strategy with ID ${id} not found`);
  //   }
  // }
}
