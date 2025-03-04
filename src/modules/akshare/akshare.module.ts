import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { AkshareController } from './akshare.controller';
import { AkshareService } from './akshare.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      ttl: 600 * 1000, // 默认缓存10分钟 (毫秒)
      max: 1000, // 最大缓存项数
      isGlobal: true, // 全局可用
    }),
  ],
  controllers: [AkshareController],
  providers: [AkshareService],
  exports: [AkshareService],
})
export class AkshareModule {}
