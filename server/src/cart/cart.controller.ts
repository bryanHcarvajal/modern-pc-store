import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartEntity } from './entities/cart.entity';

@Controller('cart')
@UseGuards(JwtAuthGuard) 
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req): Promise<CartEntity> {
    const user = req.user; 
    return this.cartService.getCart({ id: user.sub, email: user.email } as any); 
  }

  @Post('items')
  async addItem(@Req() req, @Body() addToCartDto: AddToCartDto): Promise<CartEntity> {
    const user = req.user;
    return this.cartService.addItemToCart({ id: user.sub, email: user.email } as any, addToCartDto);
  }

  @Patch('items/:itemId')
  async updateItemQuantity(
    @Req() req,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ): Promise<CartEntity> {
    const user = req.user;
    return this.cartService.updateCartItemQuantity({ id: user.sub, email: user.email } as any, itemId, updateDto);
  }

  @Delete('items/:itemId')
  async removeItem(
    @Req() req,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<CartEntity> {
    const user = req.user;
    return this.cartService.removeItemFromCart({ id: user.sub, email: user.email } as any, itemId);
  }

  @Delete() 
  async clearCart(@Req() req): Promise<CartEntity> {
    const user = req.user;
    return this.cartService.clearCart({ id: user.sub, email: user.email } as any);
  }
}