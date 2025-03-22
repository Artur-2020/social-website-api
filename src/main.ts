import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global error handling and validation filter/pipe
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorMessage: string | null = Object.values(
          errors[0].constraints ?? {},
        )[0];

        return new BadRequestException({
          success: false,
          message: errorMessage,
        });
      },
    }),
  );

  const port = configService.get<string>('port');
  await app.listen(port ?? 3000);
  console.log(`Main application is running on port ${port}`);
}
bootstrap();
