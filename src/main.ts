import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';
import { DataTransformGlobalPipe } from './common/pipes/dataTransformGlobalPipe';
import swagger from './swagger/swagger';

async function bootstrap() {
  const port = process.env.PORT;
  const host = process.env.SYSTEM_HOST;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new DataTransformGlobalPipe());
  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('NEST Project')
    .setDescription('The NEST Project API description')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc/', app, document);

  await swagger(app);

  await app.listen(port);
  Logger.log(
    `Server is Running(🔥) on http://${host}:${port}/api/v1/`,
    'NEST-BackendServer',
  );
}
bootstrap();
