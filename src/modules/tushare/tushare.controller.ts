import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TushareService } from './tushare.service';
import { Public, OnlyMaxRole } from 'src/constants';

@ApiTags('tushare')
@Controller('tushare')
export class TushareController {
  constructor(private readonly tushareService: TushareService) {}

  /**
   * 代理请求到Tushare并缓存结果
   */
  @Public()
  @Post(':apiName')
  async proxyRequest(@Param('apiName') apiName: string, @Body() body: any) {
    try {
      // 从请求体中提取params和fields
      const { params = {}, fields } = body;

      // 调用服务获取数据
      const data = await this.tushareService.getTushareData(
        apiName,
        params,
        fields,
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error proxying to Tushare',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 直接调用Tushare API（不使用缓存）
   */
  @OnlyMaxRole()
  @Post(':apiName/direct')
  async directRequest(@Param('apiName') apiName: string, @Body() body: any) {
    try {
      const { params = {}, fields } = body;
      return await this.tushareService.requestTushare(apiName, params, fields);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error calling Tushare API',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 清除特定API的缓存
   */
  @OnlyMaxRole()
  @Post('cache/invalidate/:apiName')
  async invalidateCache(@Param('apiName') apiName: string, @Body() body: any) {
    const { params, fields } = body;
    await this.tushareService.invalidateCache(apiName, params, fields);
    return { success: true, message: `Cache for ${apiName} invalidated` };
  }

  /**
   * 获取缓存统计信息
   */
  @OnlyMaxRole()
  @Get('cache/stats')
  getCacheStats() {
    return this.tushareService.getCacheStats();
  }

  /**
   * 重置缓存统计
   */
  @OnlyMaxRole()
  @Post('cache/stats/reset')
  resetCacheStats() {
    this.tushareService.resetCacheStats();
    return { success: true, message: 'Cache statistics reset' };
  }
}
