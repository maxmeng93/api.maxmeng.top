import * as path from 'path';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Query,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dto/upload.dto';
import { FileEntity } from './entity/upload.entity';
import { OnlyMaxRole, Public } from 'src/constants';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '上传文件' })
  @OnlyMaxRole()
  @Post('/file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiOkResponse({ type: FileEntity })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: process.env.UPLOAD_PATH,
        destination: (req, file, cb) => {
          const uploadPath = process.env.UPLOAD_PATH;
          let customPath = req.body.customPath || ''; // 获取请求中的 path 参数

          try {
            customPath = validatePath(customPath); // 验证并清理 customPath
          } catch (err) {
            return cb(err, null);
          }

          const fullPath = path.join(uploadPath, customPath); // 生成完整的保存路径

          // 如果文件夹还不存在，则递归创建目录
          fs.mkdir(fullPath, { recursive: true }, (err) => {
            if (err) {
              return cb(err, fullPath);
            }
            cb(null, fullPath);
          });
        },
        filename: (req, file, cb) => {
          const decodedFilename = Buffer.from(
            file.originalname,
            'latin1',
          ).toString('utf8');
          const suffix = path.extname(decodedFilename);
          const filename = decodedFilename.replace(suffix, '');
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, filename + '-' + uniqueSuffix + suffix);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileEntity> {
    return await this.uploadService.saveFile(file);
  }

  @ApiOperation({ summary: '更新文件' })
  @OnlyMaxRole()
  @Put('/file/:id')
  async updateFile(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<FileEntity> {
    return await this.uploadService.updateFile(parseInt(id, 10), content);
  }

  @ApiOperation({ summary: '删除文件' })
  @OnlyMaxRole()
  @Delete('/file/:id')
  async deleteFile(@Param('id') id: string) {
    return await this.uploadService.deleteFile(parseInt(id, 10));
  }

  @ApiOperation({ summary: '获取文件信息' })
  @Public()
  @Get('/file/:id')
  async getFile(@Param('id') id: string): Promise<FileEntity> {
    return await this.uploadService.getFile(parseInt(id, 10));
  }

  @ApiOperation({ summary: '获取文件列表' })
  @OnlyMaxRole()
  @Get('/files')
  async getAllFiles(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);

    const { list, total } = await this.uploadService.getAllFiles({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    });

    return {
      list,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    };
  }
}

// 辅助函数：验证 customPath 是否安全
function validatePath(customPath: string): string {
  if (
    customPath.includes('..') ||
    customPath.includes('.') ||
    path.isAbsolute(customPath)
  ) {
    throw new BadRequestException('Invalid custom path');
  }
  // 去除前后的斜杠，确保路径的规范性
  return customPath.replace(/^\/*|\/*$/g, '');
}
