import { File } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FileEntity implements File {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: '文件名' })
  filename: string;

  @ApiProperty({ description: '文件路径' })
  path: string;

  @ApiProperty({ description: '文件类型' })
  mimetype: string;

  @ApiProperty({ description: '文件大小' })
  size: number;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '修改时间' })
  updatedAt: Date;
}
