import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadFileDto {
  /**
   * 自定义文件路径
   * @example 'images'
   * @example 'images/avatar'
   *
   * 无效路径
   * @example '/images'
   * @example './images'
   * @example '../images'
   */
  @ApiProperty({ description: '自定义文件路径', required: false })
  @IsString()
  @IsOptional()
  customPath?: string;

  @ApiProperty({ description: '文件', type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;
}
