import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("ProductsService");
  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalRegisters = await this.product.count();
    const lastPage = Math.ceil(totalRegisters / limit!);
    if(page! > lastPage) {
      return {
        data: [],
        message: 'No more records',
      }
    }
    return {
      data: await this.product.findMany({
        skip: (page! - 1) * limit!,
        take: limit
      }),
      totalRegisters,
      currentPage: page,
      lastPage

    }
  }

  findOne(id: number) {
    const product = this.product.findUnique({
      where: { id }
    });
    if(!product) {
      return {
        message: 'Product not found',
      }
    }
    return product;
  }
s
  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
