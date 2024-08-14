import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { PrismaModule } from './modules/prisma/prisma.module';

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
        // from: `"ETF投资分析" <${process.env.EMAIL_USERNAME}>`,
        from: process.env.EMAIL_USERNAME,
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    StrategyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
