import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { UnauthorizedInterceptor } from './common/errors/interceptors/unauthorizedInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new UnauthorizedInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
