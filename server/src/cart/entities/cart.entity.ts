import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItemEntity } from './cart-item.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' }) 
  userId: string;

  @OneToOne(() => User, user => user.id, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CartItemEntity, cartItem => cartItem.cart, { cascade: true, eager: true }) 
  items: CartItemEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}