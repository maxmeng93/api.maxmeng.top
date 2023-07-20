import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = 3000;

console.log('env', process.env.NODE_ENV);

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('api example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' }, 'token')
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT);

  logger.log(`应用已启动：http://localhost:${PORT}/swagger/`);
}

bootstrap();
