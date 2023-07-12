import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { UserSubscriber } from './user.subscriber';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  providers: [UsersService, UserSubscriber],
  // controllers: [UsersController],
})
export class UsersModule {}
