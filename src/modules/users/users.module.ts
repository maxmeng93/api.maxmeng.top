import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSubscriber } from './users.subscriber';

@Module({
  imports: [PrismaModule],
  exports: [UsersService],
  providers: [UsersService],
  // providers: [UsersService, UserSubscriber],
  controllers: [UsersController],
})
export class UsersModule {}
