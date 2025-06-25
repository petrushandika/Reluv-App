import { Module } from '@nestjs/common';
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
import { StoresModule } from './stores/stores.module';
import { VariantsModule } from './variants/variants.module';
import { WishlistModule } from './wishlist/wishlist.module';

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
    StoresModule,
    VariantsModule,
    WishlistModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
