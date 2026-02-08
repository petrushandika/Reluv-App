import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { json } from 'express';
import compression from 'compression';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn'],
  });

  app.use(compression());

  app.enableCors({ origin: true, credentials: true });

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

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Reluv API')
    .setDescription(
      'API Documentation for Reluv - E-Commerce Platform for Preloved Fashion Items',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('categories', 'Category management endpoints')
    .addTag('cart', 'Shopping cart endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('payments', 'Payment processing endpoints')
    .addTag('shipments', 'Shipment tracking endpoints')
    .addTag('reviews', 'Product review endpoints')
    .addTag('wishlist', 'Wishlist management endpoints')
    .addTag('store', 'Store management endpoints')
    .addTag('locations', 'Location management endpoints')
    .addTag('vouchers', 'Voucher management endpoints')
    .addTag('discounts', 'Discount management endpoints')
    .addTag('promotions', 'Promotion management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:8000', 'Local Development')
    .addServer('https://api-reluv-app.vercel.app', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Reluv API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
}
bootstrap();
