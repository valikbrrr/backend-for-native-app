import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Body,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm);
  }

  @Get('by-slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.byCategory(categorySlug);
  }

  @Post()
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: ProductDto) {
    try {
      return await this.productService.create(dto);
    } catch (e) {
      if (e.message === 'Product name is required') {
        throw new BadRequestException(e.message);
      }
      if (e.message === 'Category not found') {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    try {
      return await this.productService.update(id, dto);
    } catch (e) {
      if (e.message === 'Product not found') {
        throw new NotFoundException('Product not found');
      }
      if (e.message === 'Category not found') {
        throw new NotFoundException('Category not found');
      }
      throw e;
    }
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
