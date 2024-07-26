import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const isDev = process.env.NODE_ENV === 'development';

const DBModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test',
  // 实体
  // entities: [User],
  // 自动加载实体
  autoLoadEntities: true,
  // TODO: 不应该在生产环境设置，否则会丢失数据
  synchronize: isDev,
});

@Module({
  imports: [
    DBModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    UsersModule,
    AuthModule,
    BookmarkModule,
    StrategyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
