import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy } from './strategy.entity';
import { StrategyDetail } from './strategy-detail.entity';

@Injectable()
export class StrategyService {
  constructor(
    @InjectRepository(Strategy)
    private readonly strategyRepository: Repository<Strategy>,
    @InjectRepository(StrategyDetail)
    private readonly strategyDetailRepository: Repository<StrategyDetail>,
  ) {}

  async createStrategy(strategyData: Partial<Strategy>): Promise<Strategy> {
    const strategy = this.strategyRepository.create(strategyData);
    return this.strategyRepository.save(strategy);
  }

  async findAll(): Promise<Strategy[]> {
    return this.strategyRepository.find({ relations: ['details'] });
  }
}
