import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({
    description: '收件人邮箱地址，可以是单个邮箱或邮箱数组',
    example: ['user1@example.com', 'user2@example.com'],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  to: string[];

  @ApiProperty({
    description: '邮件主题',
    example: '重要通知',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: '邮件纯文本内容',
    example: '这是一封测试邮件',
    required: false,
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({
    description: '邮件HTML内容',
    example: '<h1>这是一封测试邮件</h1><p>HTML格式</p>',
    required: false,
  })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiProperty({
    description: '抄送邮箱地址，可以是单个邮箱或邮箱数组',
    example: ['cc1@example.com', 'cc2@example.com'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @ApiProperty({
    description: '密送邮箱地址，可以是单个邮箱或邮箱数组',
    example: ['bcc1@example.com', 'bcc2@example.com'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];

  @ApiProperty({
    description: '附件',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        filename: { type: 'string', example: 'attachment.pdf' },
        content: { type: 'string', example: 'base64编码的文件内容' },
      },
    },
  })
  @IsOptional()
  attachments?: Array<{
    filename: string;
    content?: string;
    path?: string;
    contentType?: string;
  }>;
}
