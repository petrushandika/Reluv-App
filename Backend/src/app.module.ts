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
import { UploadModule } from './uploads/upload.module';
import { StoreModule } from './store/store.module';
import { MapsModule } from './maps/maps.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { VouchersModule } from './vouchers/vouchers.module';
import { GeocodeModule } from './geocode/geocode.module';
import { DiscountsModule } from './discounts/discounts.module';
import { PromotionsModule } from './promotions/promotions.module';
import { BadgesModule } from './badges/badges.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    EmailModule,
    VouchersModule,
    GeocodeModule,
    DiscountsModule,
    PromotionsModule,
    BadgesModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/confirm', method: RequestMethod.GET },
        { path: 'auth/google', method: RequestMethod.GET },
        { path: 'auth/google/callback', method: RequestMethod.GET },
        { path: 'auth/facebook', method: RequestMethod.GET },
        { path: 'auth/facebook/callback', method: RequestMethod.GET },
        { path: 'auth/forgot', method: RequestMethod.POST },
        { path: 'auth/reset', method: RequestMethod.POST },

        { path: 'store', method: RequestMethod.GET },
        { path: 'store/:slug', method: RequestMethod.GET },

        { path: 'products', method: RequestMethod.GET },
        { path: 'products/:slug', method: RequestMethod.GET },
        { path: 'categories', method: RequestMethod.GET },
        { path: 'categories/:id', method: RequestMethod.GET },
        { path: 'products/:productId/reviews', method: RequestMethod.GET },
        { path: 'shipping-rates/check-by-area', method: RequestMethod.POST },
        { path: 'shipping-rates/check-by-coords', method: RequestMethod.POST },
        { path: 'geocode/reverse', method: RequestMethod.GET },
        { path: 'maps/search-areas', method: RequestMethod.GET },

        { path: 'payments/midtrans-notification', method: RequestMethod.POST },
        { path: 'shipments/biteship-webhook', method: RequestMethod.POST },
        { path: 'discounts', method: RequestMethod.GET },
        { path: 'discounts/:id', method: RequestMethod.GET },
        { path: 'promotions', method: RequestMethod.GET },
        { path: 'promotions/:id', method: RequestMethod.GET },
        { path: 'badges', method: RequestMethod.GET },
        { path: 'badges/:id', method: RequestMethod.GET },
        { path: 'vouchers', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
