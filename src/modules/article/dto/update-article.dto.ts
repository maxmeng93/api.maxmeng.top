// import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends CreateArticleDto {}

export class UpdatePublishDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  isPublished: boolean;
}
