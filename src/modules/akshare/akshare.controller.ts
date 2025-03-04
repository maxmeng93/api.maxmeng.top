import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AkshareService } from './akshare.service';
import { Public } from 'src/constants';

@ApiTags('akshare')
@Controller('akshare')
export class AkshareController {
  constructor(private readonly akshareService: AkshareService) {}

  /**
   * 代理GET请求到AKShare并缓存结果
   */
  @Public()
  @Get(':apiName')
  async proxyGet(@Param('apiName') apiName: string, @Query() query: any) {
    try {
      const data = await this.akshareService.getAkshareData(apiName, query);
      return data;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error proxying to AKShare',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 代理POST请求到AKShare
   */
  @Public()
  @Post(':apiName')
  async proxyPost(@Param('apiName') apiName: string, @Body() body: any) {
    try {
      return await this.akshareService.requestAkshare('POST', apiName, body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error proxying to AKShare',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 清除特定API的缓存
   */
  @Post('cache/invalidate/:apiName')
  async invalidateCache(
    @Param('apiName') apiName: string,
    @Body() params: any,
  ) {
    await this.akshareService.invalidateCache(apiName, params);
    return { success: true, message: `Cache for ${apiName} invalidated` };
  }

  /**
   * 获取缓存统计信息
   */
  @Get('cache/stats')
  getCacheStats() {
    return this.akshareService.getCacheStats();
  }

  /**
   * 重置缓存统计
   */
  @Post('cache/stats/reset')
  resetCacheStats() {
    this.akshareService.resetCacheStats();
    return { success: true, message: 'Cache statistics reset' };
  }
}
