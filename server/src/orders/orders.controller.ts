// server/src/orders/orders.controller.ts
import { Controller, Post, Get, Param, UseGuards, Req, ParseUUIDPipe, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderEntity } from '../entities/order.entity';
import { User } from '../users/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Req() req): Promise<OrderEntity> {
    const userPayload = req.user;
    const pseudoUser = new User(); 
    pseudoUser.id = userPayload.sub;
    pseudoUser.email = userPayload.email;
    return this.ordersService.createOrderFromCart(pseudoUser);
  }

  @Get()
  async getMyOrders(@Req() req): Promise<OrderEntity[]> {
    const userPayload = req.user;
    return this.ordersService.findAllForUser(userPayload.sub);
  }

  @Get(':orderId')
  async getMyOrderById(
    @Req() req,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderEntity> { 
    const userPayload = req.user;
    const order = await this.ordersService.findOneForUser(orderId, userPayload.sub); 
    
    if (!order) { 
      throw new NotFoundException(`Orden con ID "${orderId}" no encontrada o no pertenece al usuario.`);
    }
    return order; 
  }
}