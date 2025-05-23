import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { User } from '../users/entities/user.entity'; 
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
    private productsService: ProductsService,
  ) {}

  async findOrCreateCartForUser(user: User): Promise<CartEntity> {
    let cart = await this.cartRepository.findOne({ 
      where: { userId: user.id },
      relations: ['items', 'items.product'], 
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId: user.id, user: user, items: [] });
      await this.cartRepository.save(cart);
    }
    if (cart && (!cart.items || cart.items.length === 0)) {
        const items = await this.cartItemRepository.find({where: {cartId: cart.id}, relations: ['product']});
        cart.items = items;
    }

    return cart;
  }

  async getCart(user: User): Promise<CartEntity> {
    const cart = await this.findOrCreateCartForUser(user);
    cart.items = cart.items.map(item => ({
        ...item,
        priceAtAddition: parseFloat(item.priceAtAddition as any),
        product: {
            ...item.product,
            price: parseFloat(item.product.price as any)
        }
    }));
    return cart;
  }

  async addItemToCart(user: User, addToCartDto: AddToCartDto): Promise<CartEntity> {
    const { productId, quantity = 1 } = addToCartDto;
    const cart = await this.findOrCreateCartForUser(user);
    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Producto con ID "${productId}" no encontrado.`);
    }
    if (typeof product.price !== 'number') {
        product.price = parseFloat(product.price as any);
    }


    let cartItem = cart.items.find(item => item.productId === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: product.id,
        product: product,
        quantity: quantity,
        priceAtAddition: product.price, 
      });
      cart.items.push(cartItem);
    }
    

    await this.cartItemRepository.save(cartItem); 
   

    return this.getCart(user); 
  }

  async updateCartItemQuantity(user: User, cartItemId: string, updateDto: UpdateCartItemDto): Promise<CartEntity> {
    const cart = await this.findOrCreateCartForUser(user);
    const cartItem = cart.items.find(item => item.id === cartItemId);

    if (!cartItem) {
      throw new NotFoundException(`Item del carrito con ID "${cartItemId}" no encontrado.`);
    }
    if (cartItem.cartId !== cart.id) { // Seguridad extra
        throw new NotFoundException('Item no pertenece a este carrito.');
    }

    cartItem.quantity = updateDto.quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCart(user);
  }

  async removeItemFromCart(user: User, cartItemId: string): Promise<CartEntity> {
    const cart = await this.findOrCreateCartForUser(user);
    const itemIndex = cart.items.findIndex(item => item.id === cartItemId);

    if (itemIndex === -1) {
      throw new NotFoundException(`Item del carrito con ID "${cartItemId}" no encontrado.`);
    }
    const itemToRemove = cart.items[itemIndex];
    if (itemToRemove.cartId !== cart.id) { 
        throw new NotFoundException('Item no pertenece a este carrito.');
    }

    await this.cartItemRepository.remove(itemToRemove);

    return this.getCart(user);
  }

  async clearCart(user: User): Promise<CartEntity> {
    const cart = await this.findOrCreateCartForUser(user);
    if (cart.items && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items); 
      cart.items = []; 
    }
    return cart; 
  }
}