import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import compression from 'compression';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger:
        process.env.NODE_ENV === 'production'
          ? ['error', 'warn']
          : ['log', 'error', 'warn'],
    });

    app.use(compression());
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'https://fe-reluv-app.vercel.app',
      credentials: true,
    });
    app.use(json({ limit: '1mb' }));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.setGlobalPrefix('api/v1');
    await app.init();
  }
  return app;
}

export default async (req: any, res: any) => {
  const nestApp = await bootstrap();
  const handler = nestApp.getHttpAdapter().getInstance();
  return handler(req, res);
};
