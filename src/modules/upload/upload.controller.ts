import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dto/upload.dto';
import { FileEntity } from './entity/upload.entity';
import { OnlyMaxRole, Public } from 'src/constants';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @OnlyMaxRole()
  @Post('/file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiOkResponse({ type: FileEntity })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH,
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

  @OnlyMaxRole()
  @Put('/file/:id')
  async updateFile(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<FileEntity> {
    return await this.uploadService.updateFile(parseInt(id, 10), content);
  }

  @OnlyMaxRole()
  @Get('/files')
  async getAllFiles() {
    return await this.uploadService.getAllFiles();
  }

  @Public()
  @Get('/file/:id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadService.getFile(parseInt(id, 10));
    if (!file) {
      return res.status(404).send('File not found');
    }

    const filePath = path.join(process.env.UPLOAD_PATH, file.path);
    // 中文文件名需要转码
    const encodedFilename = encodeURIComponent(file.filename).replace(
      /['()]/g,
      escape,
    );
    const fileStream = this.uploadService.getFileStream(filePath);
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodedFilename}"`, // 预览
      // `inline; filename*=UTF-8''${encodedFilename}`, // 预览
      // `attachment; filename*=UTF-8''${encodedFilename}`, // 下载
    );
    fileStream.pipe(res);
  }
}
