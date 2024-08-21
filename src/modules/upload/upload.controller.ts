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
import { OnlyMaxRole } from 'src/constants';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @OnlyMaxRole()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiOkResponse({ type: FileEntity })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileEntity> {
    return await this.uploadService.saveFile(file);
  }

  @Put(':id')
  async updateFile(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<FileEntity> {
    return await this.uploadService.updateFile(parseInt(id, 10), content);
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadService.getFile(parseInt(id, 10));
    if (!file) {
      return res.status(404).send('File not found');
    }

    const filePath = path.join(process.env.UPLOAD_PATH, file.path);
    const fileStream = this.uploadService.getFileStream(filePath);
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    fileStream.pipe(res);
  }
}
