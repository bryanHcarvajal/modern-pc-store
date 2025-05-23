import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional() 
  @IsInt()
  @Min(1)
  quantity?: number;
}