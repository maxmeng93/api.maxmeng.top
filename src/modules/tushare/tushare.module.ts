import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TushareController } from './tushare.controller';
import { TushareService } from './tushare.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      ttl: 1000 * 60 * 10, // 默认缓存10分钟 (毫秒)
      max: 1000, // 最大缓存项数
      isGlobal: true, // 全局可用
    }),
  ],
  controllers: [TushareController],
  providers: [TushareService],
  exports: [TushareService],
})
export class TushareModule {}
