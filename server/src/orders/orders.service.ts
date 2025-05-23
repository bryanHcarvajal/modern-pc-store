import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../users/entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemsRepository: Repository<OrderItemEntity>,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
  ) {}

  async createOrderFromCart(user: User): Promise<OrderEntity> {
    const cart = await this.cartService.getCart(user); 

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío. No se puede crear una orden.');
    }

    this.logger.log(`Creando orden para usuario ${user.id} desde carrito ID ${cart.id}`);
    
    let totalAmount = 0;
    const orderItemsData: Partial<OrderItemEntity>[] = [];

    for (const cartItem of cart.items) {
      if (!cartItem.product) {
        this.logger.warn(`Detalles del producto no encontrados para CartItem ID ${cartItem.id} (productId: ${cartItem.productId}). Se omitirá este item.`);
        continue;
      }
      const productEntity = cartItem.product as ProductEntity;
      const priceAtPurchase = cartItem.priceAtAddition; 

      if (typeof priceAtPurchase !== 'number' || isNaN(priceAtPurchase)) {
          this.logger.error(`Precio inválido para producto ID ${productEntity.id} en el carrito. Precio guardado: ${cartItem.priceAtAddition}`);
          throw new BadRequestException(`Precio inválido para el producto en el carrito: ${productEntity.name}`);
      }

      orderItemsData.push({
        productId: productEntity.id,
        productName: productEntity.name, 
        quantity: cartItem.quantity,
        priceAtPurchase: priceAtPurchase,
      });
      totalAmount += priceAtPurchase * cartItem.quantity;
    }

    if (orderItemsData.length === 0) {
      throw new BadRequestException('No hay items válidos en el carrito para crear la orden.');
    }
    
    const orderItems = orderItemsData.map(itemData => this.orderItemsRepository.create(itemData));

    const newOrder = this.ordersRepository.create({
      userId: user.id,
      user: user,
      items: orderItems,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: OrderStatus.COMPLETED,
    });

    this.logger.log(`Guardando nueva orden para usuario ${user.id}`);
    const savedOrder = await this.ordersRepository.save(newOrder); 

    this.logger.log(`Orden ID ${savedOrder.id} creada. Procediendo a limpiar el carrito.`);
    await this.cartService.clearCart(user);

    const finalOrder = await this.ordersRepository.findOne({
        where: { id: savedOrder.id },
        relations: {
            items: {
                product: true 
            }
        },
    });

    if (!finalOrder) {
        this.logger.error(`CRITICAL ERROR: Orden ${savedOrder.id} no encontrada después de guardarla.`);
        throw new Error('Error crítico al procesar el pedido. La orden no pudo ser recuperada.');
    }
    
    return finalOrder;
  }

  async findAllForUser(userId: string): Promise<OrderEntity[]> {
    this.logger.log(`Buscando todas las órdenes para el usuario ID: ${userId}`);
    return this.ordersRepository.find({
      where: { userId: userId },
      relations: { 
        items: {      
          product: true 
        }
      },
      order: { createdAt: 'DESC' }, 
    });
  }

  async findOneForUser(orderId: string, userId: string): Promise<OrderEntity | undefined> {
    this.logger.log(`Buscando orden ID: ${orderId} para usuario ID: ${userId}`);
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, userId: userId },
      relations: {
        items: {
          product: true
        }
      },
          order: { createdAt: 'DESC' },
    });
    return order || undefined;
  }
}