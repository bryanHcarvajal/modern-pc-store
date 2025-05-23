import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity]),
    ProductsModule,
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule {}