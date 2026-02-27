import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsUrl,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
