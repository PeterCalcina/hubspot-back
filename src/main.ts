import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/all-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
