import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { OrderItemEntity } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',       
  PROCESSING = 'PROCESSING',  
  COMPLETED = 'COMPLETED',   //Solo se usará Completed por fines ilustrativos.
  CANCELLED = 'CANCELLED',   
  FAILED = 'FAILED',         
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { eager: false, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'userId' })
  user: User; 

  @OneToMany(() => OrderItemEntity, orderItem => orderItem.order, { cascade: true, eager: true })
  items: OrderItemEntity[]; 

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.COMPLETED, 
  })
  status: OrderStatus;

  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}