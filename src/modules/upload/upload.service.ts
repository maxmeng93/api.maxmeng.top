import * as path from 'path';
import { writeFile, unlink } from 'fs';
import { promisify } from 'util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async saveFile(file: Express.Multer.File) {
    const { filename, path: url, mimetype, size } = file;

    const filePath = url.replace(process.env.UPLOAD_PATH, '');

    return this.prisma.file.create({
      data: {
        filename,
        path: filePath,
        mimetype,
        size,
      },
    });
  }

  async updateFile(id: number, content: string) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }

    if (path.extname(file.filename).toLowerCase() !== '.md') {
      throw new Error('Only Markdown files can be updated');
    }

    const filePath = path.join(process.env.UPLOAD_PATH, file.path);
    await writeFileAsync(filePath, content, 'utf8');

    return this.prisma.file.update({
      where: { id },
      data: {
        size: Buffer.byteLength(content, 'utf8'),
        updatedAt: new Date(),
      },
    });
  }

  async getAllFiles(params: { skip?: number; take?: number }) {
    const { skip, take } = params;

    const [list, total] = await Promise.all([
      this.prisma.file.findMany({
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.file.count(),
    ]);

    return { list, total };
  }

  async getFile(id: number) {
    return this.prisma.file.findUnique({ where: { id } });
  }

  async deleteFile(id: number) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException(`没有找到id为${id}的文件`);
    }

    const filePath = path.join(process.env.UPLOAD_PATH, file.path);

    try {
      await unlinkAsync(filePath);
    } catch (error) {
      console.error(`Error deleting file from filesystem: ${error.message}`);
    }

    return this.prisma.file.delete({ where: { id } });
  }
}
