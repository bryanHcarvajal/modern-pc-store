import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string; // ID del ProductEntity

  @ManyToOne(() => ProductEntity, { eager: true, onDelete: 'SET NULL' }) // Si el producto se borra, el item de orden lo refleja
  @JoinColumn({ name: 'productId' })
  product: ProductEntity; // Detalles del producto en el momento de la compra

  @Column({ length: 255 }) // Guardar el nombre del producto en el momento de la compra
  productName: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtPurchase: number; // Precio unitario del producto al momento de la compra

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => OrderEntity, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;
}