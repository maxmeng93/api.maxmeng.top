import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  Logger,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import { PrismaClientExceptionFilter } from 'src/filters';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  // 获取 ConfigService 实例
  const configService = app.get(ConfigService);

  // 从环境变量中获取 PORT
  const PORT = configService.get<number>('PORT') || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      // 过滤DTO中不存在或没有添加任何验证修饰器的属性
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();
  // app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API MAXMENG TOP')
    .setDescription('接口文档')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' }, 'token')
    .addSecurityRequirements('token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
    swaggerOptions: {
      persistAuthorization: true,
      exportButton: true,
    },
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(PORT);

  logger.log(`应用已启动：http://localhost:${PORT}/swagger/`);
}

bootstrap();
