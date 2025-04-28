import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { returnProductObject } from './return-product.object';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.search(searchTerm);

    return this.prisma.product.findMany({
      select: returnProductObject,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async search(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: returnProductObject,
    });
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
      },
      select: returnProductObject,
    });

    if (!product) throw new Error('Product not found');

    return product;
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: returnProductObject,
    });

    if (!products) throw new Error('Products not found');

    return products;
  }

  async create(dto: ProductDto) {
    // Проверка категории
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
        image: dto.image || '/default-product.png',
        description: dto.description || '',
        price: Number(dto.price),
        category: {
          connect: {
            id: dto.categoryId,
          },
        },
      },
    });
  }

  async update(id: string, dto: ProductDto) {
    // Сначала проверяем существование продукта
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Затем проверяем категорию
    await this.categoryService.byId(dto.categoryId);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        slug: generateSlug(dto.name),
        category: {
          connect: {
            id: dto.categoryId,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
