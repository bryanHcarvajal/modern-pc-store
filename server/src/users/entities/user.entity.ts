// server/src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true, length: 50 })
  firstName?: string;

  @Column({ nullable: true, length: 50 })
  lastName?: string;

  // ADD THIS:
  @Column({
    type: 'enum',        // Specify the column type as enum
    enum: UserRole,      // Point to your UserRole enum
    array: true,         // Indicate that it's an array of enums
    default: [UserRole.USER] // Set a default value at the database level
  })
  roles: UserRole[];     // Define the property

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && (this.password.length < 60 || !this.password.startsWith('$2'))) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    if (!this.password || !attempt) return false;
    return bcrypt.compare(attempt, this.password);
  }

  // Optional: Add a hook to ensure roles are set if not provided during creation
  @BeforeInsert()
  setDefaultRoles() {
    if (!this.roles || this.roles.length === 0) {
      this.roles = [UserRole.USER];
    }
  }
}