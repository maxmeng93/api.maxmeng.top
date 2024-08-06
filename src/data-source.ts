import { DataSource } from 'typeorm';
import { Strategy } from './modules/strategy/strategy.entity';
import { StrategyDetail } from './modules/strategy/strategy-detail.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test',
  entities: [Strategy, StrategyDetail],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
});
