// server/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProductEntity } from './products/entities/product.entity'; 
import { CartEntity } from './cart/entities/cart.entity';         
import { CartItemEntity } from './cart/entities/cart-item.entity'; 
import { CartModule } from './cart/cart.module';              
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { OrdersModule } from './orders/orders.module'; 
import { OrderEntity } from './entities/order.entity'; 
import { OrderItemEntity } from './entities/order-item.entity'; 


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<string>('DB_PORT');
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbDatabase = configService.get<string>('DB_DATABASE');
        const dbSynchronize = configService.get<string>('DB_SYNCHRONIZE');

        if (!dbHost || !dbPort || !dbUsername || !dbDatabase) {
          throw new Error('Faltan variables de entorno críticas para la base de datos.');
        }

        return {
          type: 'postgres',
          host: dbHost,
          port: parseInt(dbPort!, 10),
          username: dbUsername!,
          password: dbPassword || '', 
          database: dbDatabase!,
          entities: [User, ProductEntity,  CartEntity, CartItemEntity, OrderEntity, OrderItemEntity],
          synchronize: dbSynchronize === 'true',
          // logging: true, 
        };
      },
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    CartModule,
    OrdersModule, 
  ],
  controllers: [AppController], // <--- SOLO AppController
  providers: [AppService],      // <--- SOLO AppService
})
export class AppModule {}