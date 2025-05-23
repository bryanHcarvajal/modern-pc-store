import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string; 

  @ManyToOne(() => ProductEntity, { eager: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'productId' })
  product: ProductEntity; 

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtAddition: number; 

  @Column({ type: 'uuid' })
  cartId: string;

  @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;
}