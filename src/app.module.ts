import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './modules/user/user.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { ConfigModule } from './modules/config/config.modules';

import * as dotenv from 'dotenv';

console.log(ConfigModule);

dotenv.config({ path: '.env' });

const DBModule = MongooseModule.forRoot(process.env.MONGOOSE_URL);
@Module({
  imports: [DBModule, ConfigModule, UserModule, BookmarkModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
