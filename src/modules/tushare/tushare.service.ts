import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import {
  TushareRequest,
  TushareResponse,
  TushareApiResult,
} from './tushare.interface';

@Injectable()
export class TushareService {
  private readonly logger = new Logger(TushareService.name);
  private readonly baseUrl: string;
  private readonly token: string;

  // 不同类型数据的缓存时间配置（秒）
  private readonly cacheTTLConfig = {
    // 基础信息类数据长缓存
    stock_basic: 86400, // 股票基础信息缓存1天
    fund_basic: 86400, // 基金基础信息缓存1天

    // 财务数据中缓存
    income: 3600 * 12, // 利润表缓存12小时
    balancesheet: 3600 * 12, // 资产负债表缓存12小时
    cashflow: 3600 * 12, // 现金流量表缓存12小时

    // 行情数据短缓存
    daily: 600, // 日线数据缓存10分钟
    weekly: 1800, // 周线数据缓存30分钟
    monthly: 3600, // 月线数据缓存1小时

    // 实时行情数据极短缓存
    quotes: 30, // 实时行情数据缓存30秒

    // 默认缓存时间（10分钟）
    default: 600,
  };

  // 缓存统计
  private cacheHits = 0;
  private cacheMisses = 0;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // 从环境变量获取Tushare API令牌
    this.token = process.env.TUSHARE_API_TOKEN || '';
    if (!this.token) {
      this.logger.warn(
        'Tushare API token not set. Set TUSHARE_API_TOKEN in env variables.',
      );
    }

    // 从环境变量获取API地址，默认为Tushare官方API
    this.baseUrl = process.env.TUSHARE_URL || 'http://api.tushare.pro';
    this.logger.log(`Tushare service URL: ${this.baseUrl}`);
  }

  /**
   * 获取适合特定API的缓存时间
   */
  private getCacheTTL(apiName: string): number {
    return this.cacheTTLConfig[apiName] || this.cacheTTLConfig['default'];
  }

  /**
   * 创建缓存键
   */
  private createCacheKey(
    apiName: string,
    params?: any,
    fields?: string,
  ): string {
    return `tushare_${apiName}_${JSON.stringify(params || {})}_${fields || ''}`;
  }

  /**
   * 获取Tushare数据并缓存结果
   */
  public async getTushareData<T>(
    apiName: string,
    params?: any,
    fields?: string,
    options?: AxiosRequestConfig,
  ): Promise<TushareApiResult<T>> {
    const cacheKey = this.createCacheKey(apiName, params, fields);
    this.logger.debug(`尝试获取Tushare数据，缓存键: ${cacheKey}`);

    // 尝试从缓存获取数据
    try {
      const cachedData = await this.cacheManager.get<TushareApiResult<T>>(
        cacheKey,
      );
      if (cachedData) {
        this.cacheHits++;
        this.logger.debug(`缓存命中 ${cacheKey}`);
        return cachedData;
      }
    } catch (error) {
      this.logger.warn(`Error retrieving from cache: ${error.message}`);
    }

    this.cacheMisses++;
    this.logger.debug(`缓存未命中 ${cacheKey}`);

    // 构建Tushare请求数据
    const requestData: TushareRequest = {
      api_name: apiName,
      token: this.token,
      params: params || {},
    };

    if (fields) {
      requestData.fields = fields;
    }

    // 从Tushare API获取数据
    try {
      const response = await lastValueFrom(
        this.httpService.post<TushareResponse<T>>(
          this.baseUrl,
          requestData,
          options,
        ),
      );

      const tushareData = response.data;

      // 将Tushare响应转换为统一格式
      const formattedData: TushareApiResult<T> = {
        code: tushareData.code,
        message: tushareData.msg,
        data: this.transformTushareData(tushareData.data) as T,
      };

      // 获取适合该API的缓存时间
      const ttl = this.getCacheTTL(apiName);

      // 存入缓存
      await this.cacheManager.set(cacheKey, formattedData, ttl * 1000);
      this.logger.debug(`Stored in cache: ${cacheKey} with TTL: ${ttl}s`);

      return formattedData;
    } catch (error) {
      this.logger.error(`从Tushare获取数据出错: ${error.message}`);

      // 尝试返回可能过期的缓存数据作为兜底
      const staleData = await this.cacheManager.get<TushareApiResult<T>>(
        cacheKey,
      );
      if (staleData) {
        this.logger.warn(`由于Tushare错误，返回${apiName}的陈旧数据`);
        return staleData;
      }

      throw error;
    }
  }

  /**
   * 转换Tushare数据到结构化格式
   * Tushare返回的是fields和items分开的格式，我们转为对象数组
   */
  private transformTushareData(data: any): any {
    return data;
    // if (!data || !data.fields || !data.items) {
    //   return [];
    // }

    // const { fields, items } = data;
    // return items.map((item) => {
    //   const obj = {};
    //   fields.forEach((field, index) => {
    //     obj[field] = item[index];
    //   });
    //   return obj;
    // });
  }

  /**
   * 直接请求Tushare API（不缓存）
   */
  public async requestTushare<T>(
    apiName: string,
    params?: any,
    fields?: string,
    config?: AxiosRequestConfig,
  ): Promise<TushareApiResult<T>> {
    const requestData: TushareRequest = {
      api_name: apiName,
      token: this.token,
      params: params || {},
    };

    if (fields) {
      requestData.fields = fields;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post<TushareResponse<T>>(
          this.baseUrl,
          requestData,
          config,
        ),
      );

      const tushareData = response.data;

      return {
        code: tushareData.code,
        message: tushareData.msg,
        data: this.transformTushareData(tushareData.data) as T,
      };
    } catch (error) {
      this.logger.error(
        `Error requesting Tushare API ${apiName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * 手动清除特定API的缓存
   */
  public async invalidateCache(
    apiName: string,
    params?: any,
    fields?: string,
  ): Promise<void> {
    const cacheKey = this.createCacheKey(apiName, params, fields);
    await this.cacheManager.del(cacheKey);
    this.logger.log(`Cache invalidated: ${cacheKey}`);
  }

  /**
   * 获取缓存统计信息
   */
  public getCacheStats() {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? (this.cacheHits / total) * 100 : 0;

    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      total: total,
      hitRate: `${hitRate.toFixed(2)}%`,
    };
  }

  /**
   * 重置缓存统计
   */
  public resetCacheStats() {
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}
