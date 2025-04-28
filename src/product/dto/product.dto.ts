import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsNumber()
  price: number;
}
