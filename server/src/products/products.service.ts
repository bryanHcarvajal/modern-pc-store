import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService implements OnModuleInit { 
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  private readonly initialProductsData: Omit<ProductEntity, 'createdAt' | 'updatedAt'>[] = [
    {
      id: 'gpu-rx5700xt',
      name: 'Radeon RX 5700 XT',
      type: 'GPU',
      amdChip: 'Radeon RX 5700 XT',
      price: 299.99,
      specs: ['8GB GDDR6', 'Arquitectura RDNA', 'PCIe 4.0 Ready'],
      imageUrl: 'https://media.spdigital.cl/thumbnails/products/tjr0jrlb_0fce15a1_thumbnail_4096.jpg', 
    },
    {
      id: 'gpu-rx7800xt',
      name: 'Radeon RX 7800 XT',
      type: 'GPU',
      amdChip: 'Radeon RX 7800 XT',
      price: 499.99,
      specs: ['16GB GDDR6', 'Arquitectura RDNA 3', 'Ray Tracing Avanzado'],
      imageUrl: 'https://www.winpy.cl/files/40481-6096-Gigabyte-Radeon-RX-7800-XT-GAMING-OC-de-16G-1.jpg',
    },
    {
      id: 'gpu-rx7900xtx',
      name: 'Radeon RX 7900 XTX',
      type: 'GPU',
      amdChip: 'Radeon RX 7900 XTX',
      price: 999.99,
      specs: ['24GB GDDR6', 'Diseño Chiplet', 'DisplayPort 2.1'],
      imageUrl: 'https://static.gigabyte.com/StaticFile/Image/Global/ffebdb331cdc6e8eecf7f2b4b42b8232/Product/32793', // URL actualizada, la anterior era 403
    },
    {
      id: 'cpu-r5-7600x',
      name: 'AMD Ryzen 5 7600X',
      type: 'CPU',
      amdChip: 'Ryzen 5 7600X',
      price: 229.00,
      specs: ['6 Núcleos', '12 Hilos', 'Hasta 5.3GHz Boost', 'Socket AM5'],
      imageUrl: 'https://media.solotodo.com/media/products/1647078_picture_1672267310.jpg', 
    },
    {
      id: 'cpu-r7-7800x3d',
      name: 'AMD Ryzen 7 7800X3D',
      type: 'CPU',
      amdChip: 'Ryzen 7 7800X3D',
      price: 449.00,
      specs: ['8 Núcleos', '16 Hilos', 'AMD 3D V-Cache™', 'Gaming Optimizado'],
      imageUrl: 'https://sipoonline.cl/wp-content/uploads/2023/07/Procesador-AMD-Ryzen-7-7800X3D-100-100000910WOF.png',
    },
    {
      id: 'cpu-r9-7950x',
      name: 'AMD Ryzen 9 7950X',
      type: 'CPU',
      amdChip: 'Ryzen 9 7950X',
      price: 549.00,
      specs: ['16 Núcleos', '32 Hilos', 'Hasta 5.7GHz Boost', 'Productividad Extrema'],
      imageUrl: 'https://media.solotodo.com/media/products/1647114_picture_1672267314.jpg',
    },
  ];

  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      console.log('Base de datos de productos vacía, sembrando datos iniciales...');
      for (const productData of this.initialProductsData) {
        const product = this.productsRepository.create(productData as ProductEntity);
        await this.productsRepository.save(product).catch(error => {
            console.error(`Error al sembrar producto ${productData.id}:`, error.message);
        });
      }
      console.log('Datos iniciales de productos sembrados.');
    }
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {

    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productsRepository.find();
    return products.map(product => ({
        ...product,
        price: parseFloat(product.price as any),
    }));
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado.`);
    }
    return {
        ...product,
        price: parseFloat(product.price as any),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {

    const product = await this.productsRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado para actualizar.`);
    }
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<{ message: string, id: string }> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado para eliminar.`);
    }
    return { message: `Producto con ID "${id}" eliminado exitosamente.`, id };
  }
}