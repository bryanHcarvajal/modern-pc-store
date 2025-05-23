import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsUrl, IsArray, ArrayMinSize, IsEnum } from 'class-validator';

export enum ProductTypeDto { 
    CPU = 'CPU',
    GPU = 'GPU',
}

export class CreateProductDto {
@IsNotEmpty({ message: 'El ID del producto es obligatorio (ej. gpu-rx7800xt)'})
@IsString()
id: string; 

@IsNotEmpty({ message: 'El nombre es obligatorio.' })
@IsString()
name: string;

@IsNotEmpty({ message: 'El tipo es obligatorio (CPU o GPU).' })
@IsEnum(ProductTypeDto, { message: 'Tipo debe ser CPU o GPU.' })
type: 'CPU' | 'GPU';

@IsOptional()
@IsString()
amdChip?: string;

@IsNotEmpty({ message: 'El precio es obligatorio.' })
@IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con hasta 2 decimales.'})
@Min(0.01, { message: 'El precio debe ser mayor que cero.' })
price: number;

@IsArray({ message: 'Las especificaciones deben ser un array.' })
@ArrayMinSize(1, { message: 'Debe haber al menos una especificación.'})
@IsString({ each: true, message: 'Cada especificación debe ser un texto.' })
specs: string[];

@IsOptional()
@IsUrl({}, { message: 'La URL de la imagen no es válida.' })
imageUrl?: string;
}