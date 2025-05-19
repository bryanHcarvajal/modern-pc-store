// server/src/products/products.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.interface';

@Controller('products') 
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get() 
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id') id: string): Product {
    try {
      return this.productsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error; 
    }
  }
}