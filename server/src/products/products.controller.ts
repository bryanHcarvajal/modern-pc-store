import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus,  NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity'; 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';     
import { Roles } from '../auth/decorators/roles.decorator';   
import { UserRole } from '../users/entities/user.entity';    

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Proteger con JWT y luego verificar roles
  @Roles(UserRole.ADMIN) // Solo usuarios con rol 'admin' pueden crear
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    // El ParseUUIDPipe no aplica si tus IDs son strings como 'gpu-rx7800xt'
    // Si fueran UUIDs reales, sí: @Param('id', ParseUUIDPipe) id: string
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK) // O HttpStatus.NO_CONTENT si no devuelves cuerpo
  async remove(@Param('id') id: string): Promise<{ message: string, id: string }> {
    return this.productsService.remove(id);
  }
}