import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GoogleModule } from './google/google.module';
import { FacebookModule } from './facebook/facebook.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ShippingRatesModule } from './shipping-rates/shipping-rates.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { WishlistModule } from './wishlist/wishlist.module';
import { LocationsModule } from './locations/locations.module';
import { UploadModule } from './upload/upload.module';
import { StoreModule } from './store/store.module';
import { MapsModule } from './maps/maps.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CloudinaryModule,
    GoogleModule,
    FacebookModule,
    AuthModule,
    CartModule,
    ProductsModule,
    CategoriesModule,
    NotificationsModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
    ShipmentsModule,
    ShippingRatesModule,
    WishlistModule,
    LocationsModule,
    UploadModule,
    StoreModule,
    MapsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/google', method: RequestMethod.GET },
        { path: '/auth/google/callback', method: RequestMethod.GET },
        { path: '/auth/facebook', method: RequestMethod.GET },
        { path: '/auth/facebook/callback', method: RequestMethod.GET },
        { path: '/auth/forgot', method: RequestMethod.POST },
        { path: '/auth/reset', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
