import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { VariantsModule } from './variants/variants.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StoresModule } from './stores/stores.module';
import { AddressesModule } from './addresses/addresses.module';
import { ShippingRatesModule } from './shipping-rates/shipping-rates.module';

@Module({
  imports: [UsersModule, AuthModule, ProductsModule, ReviewsModule, VariantsModule, CategoriesModule, OrdersModule, PaymentsModule, ShipmentsModule, CartModule, WishlistModule, NotificationsModule, StoresModule, AddressesModule, ShippingRatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
