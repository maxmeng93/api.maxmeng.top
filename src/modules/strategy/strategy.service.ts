import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy } from './strategy.entity';
import { StrategyDetail } from './strategy-detail.entity';
import { CreateStrategyDto } from './dto/create-strategy.dto';

@Injectable()
export class StrategyService {
  constructor(
    @InjectRepository(Strategy)
    private strategyRepository: Repository<Strategy>,
    @InjectRepository(StrategyDetail)
    private strategyDetailRepository: Repository<StrategyDetail>,
  ) {}

  async create(createStrategyDto: CreateStrategyDto): Promise<Strategy> {
    const strategy = this.strategyRepository.create(createStrategyDto);
    return this.strategyRepository.save(strategy);
  }

  findAll(): Promise<Strategy[]> {
    return this.strategyRepository.find({ relations: ['details'] });
  }

  async findOne(id: number): Promise<Strategy> {
    const strategy = await this.strategyRepository.findOne({
      where: { id },
      relations: ['details'],
    });
    if (!strategy) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
    return strategy;
  }

  async remove(id: number): Promise<void> {
    const result = await this.strategyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
  }
}
