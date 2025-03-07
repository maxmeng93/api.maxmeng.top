import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  UserModule,
  AuthModule,
  StrategyModule,
  PrismaModule,
  UploadModule,
  ArticleModule,
  AkshareModule,
  MailModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: true,
        },
      },
      defaults: {
        from: `"etf.maxmeng.top" <${process.env.EMAIL_USERNAME}>`,
        // from: process.env.EMAIL_USERNAME,
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    StrategyModule,
    UploadModule,
    ArticleModule,
    AkshareModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
