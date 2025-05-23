import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transform } from 'class-transformer'; 

@Entity('products') 
export class ProductEntity { 
  @PrimaryColumn({ length: 50 }) 
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'enum', enum: ['GPU', 'CPU'] })
  type: 'GPU' | 'CPU';

  @Column({ nullable: true, length: 100 })
  amdChip?: string;

  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true }) 
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('simple-array') 
  specs: string[];

  @Column({ nullable: true, type: 'text' }) 
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}