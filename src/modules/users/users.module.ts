import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  exports: [UsersService],
  providers: [UsersService],
  // providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
