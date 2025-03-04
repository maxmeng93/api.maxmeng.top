import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { AkshareResponse } from './akshare.interface';

@Injectable()
export class AkshareService {
  private readonly logger = new Logger(AkshareService.name);
  private readonly baseUrl: string;

  // 不同类型数据的缓存时间配置（秒）
  private readonly cacheTTLConfig = {
    // 实时行情数据短时间缓存
    stock_zh_a_spot: 30, // A股实时行情
    stock_hk_spot: 30, // 港股实时行情
    stock_us_spot: 30, // 美股实时行情

    // 日K线数据较长缓存
    stock_zh_a_daily: 3600, // A股日线数据缓存1小时
    stock_hk_daily: 3600, // 港股日线数据
    stock_us_daily: 3600, // 美股日线数据

    // 静态数据长缓存
    stock_info_a_code_name: 86400, // A股代码列表缓存1天
    stock_info_sh_name_code: 86400, // 上交所股票列表
    stock_info_sz_name_code: 86400, // 深交所股票列表

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
    // 从环境变量或配置获取AKShare服务地址
    this.baseUrl = process.env.AKSHARE_URL || 'http://localhost:8080';
    this.logger.log(`AKShare service URL: ${this.baseUrl}`);
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
  private createCacheKey(apiName: string, params?: any): string {
    return `akshare_${apiName}_${JSON.stringify(params || {})}`;
  }

  /**
   * 获取AKShare数据并缓存结果
   */
  public async getAkshareData<T>(
    apiName: string,
    params?: any,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    const cacheKey = this.createCacheKey(apiName, params);

    console.log('cacheKey', cacheKey);

    // 尝试从缓存获取数据
    try {
      const cachedData = await this.cacheManager.get<T>(cacheKey);
      console.log('cachedData');
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

    // 从AKShare服务获取数据
    try {
      const url = `${this.baseUrl}/api/public/${apiName}`;
      const response = await lastValueFrom(
        this.httpService.get<AkshareResponse<T>>(url, {
          params,
          ...options,
        }),
      );

      console.log('response');

      const data = response.data;

      // 获取适合该API的缓存时间
      const ttl = this.getCacheTTL(apiName);

      // 存入缓存
      await this.cacheManager.set(cacheKey, data, ttl * 1000);
      this.logger.debug(`Stored in cache: ${cacheKey} with TTL: ${ttl}s`);

      return data as any;
    } catch (error) {
      this.logger.error(`从AKShare获取数据出错: ${error.message}`);

      // 尝试返回可能过期的缓存数据作为兜底
      const staleData = await this.cacheManager.get<T>(cacheKey);
      if (staleData) {
        this.logger.warn(`由于AKShare错误，返回${apiName}的陈旧数据`);
        return staleData;
      }

      throw error;
    }
  }

  /**
   * 直接请求AKShare服务（不缓存）
   */
  public async requestAkshare<T>(
    method: string,
    apiName: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const url = `${this.baseUrl}/api/public/${apiName}`;

    try {
      let response;
      if (method.toUpperCase() === 'GET') {
        response = await lastValueFrom(
          this.httpService.get<AkshareResponse<T>>(url, {
            params: data,
            ...config,
          }),
        );
      } else if (method.toUpperCase() === 'POST') {
        response = await lastValueFrom(
          this.httpService.post<AkshareResponse<T>>(url, data, config),
        );
      } else {
        throw new Error(`Unsupported method: ${method}`);
      }

      return response.data.data;
    } catch (error) {
      this.logger.error(
        `Error requesting AKShare API ${apiName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * 手动清除特定API的缓存
   */
  public async invalidateCache(apiName: string, params?: any): Promise<void> {
    const cacheKey = this.createCacheKey(apiName, params);
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
