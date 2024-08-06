import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 使 PrismaService 全局可用
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
