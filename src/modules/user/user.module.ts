import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
