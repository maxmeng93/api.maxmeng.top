import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Strategy } from './strategy.entity';
import { StrategyDetail } from './strategy-detail.entity';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Strategy, StrategyDetail])],
  providers: [StrategyService],
  controllers: [StrategyController],
})
export class StrategyModule {}
