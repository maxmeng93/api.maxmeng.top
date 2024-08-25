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
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 获取 ConfigService 实例
  const configService = app.get(ConfigService);

  // 从环境变量中获取 PORT
  const PORT = configService.get<number>('PORT') || 3000;

  // 设置静态文件服务
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
    maxAge: 86400000, // 缓存1天
    immutable: false,
    etag: true,
    lastModified: true,
    // setHeaders: (res, path, stat) => {
    //   if (path.match(/\.(css|js|jpg|jpeg|png|gif)$/)) {
    //     // 静态资源使用较短的缓存时间，并要求重新验证
    //     res.setHeader(
    //       'Cache-Control',
    //       'public, max-age=86400, must-revalidate',
    //     );
    //   } else {
    //     // 其他文件使用更短的缓存时间
    //     res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    //   }

    //   res.setHeader('Vary', 'Accept-Encoding');
    // },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // 过滤DTO中不存在或没有添加任何验证修饰器的属性
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();

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
