import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity'; 
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), AuthModule,],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService] 
})
export class ProductsModule {}